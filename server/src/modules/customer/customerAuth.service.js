/**
 * Customer Auth Service
 * Authentication & Password management for storefront customers using Customer model.
 */

import crypto from "crypto";
import Customer from "./customer.model.js";
import { AppError } from "../../utils/AppError.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { generateOtp, generateOtpExpiry } from "../../utils/generateOtp.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { MESSAGES } from "../../constants/messages.js";
import { HTTP_STATUS, STATUS } from "../../constants/status.js";
import Token from "../auth/auth.token.model.js";

// Helper to sanitize customer object
const sanitizeCustomer = (customerDoc) => {
  const customer = customerDoc.toObject ? customerDoc.toObject() : { ...customerDoc };
  delete customer.password;
  delete customer.otp;
  delete customer.passwordResetToken;
  delete customer.passwordResetExpires;
  delete customer.refreshToken;
  return customer;
};

/**
 * Customer Registration
 */
export const register = async ({ firstName, lastName, name, email, password, phone }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await Customer.findOne({ email: normalizedEmail });
  if (existing) {
    throw new AppError(MESSAGES.AUTH.EMAIL_EXISTS || "An account with this email already exists.", HTTP_STATUS.CONFLICT);
  }

  const fullName = (name || `${firstName || ""} ${lastName || ""}`).trim();
  if (!fullName) {
    throw new AppError("Name is required.", HTTP_STATUS.BAD_REQUEST);
  }

  const { otp, otpHash } = generateOtp(6);
  const expiresAt = generateOtpExpiry(10);

  const customer = await Customer.create({
    name: fullName,
    email: normalizedEmail,
    password, // pre-save hook in customer.model.js hashes password
    phone: phone || null,
    isVerified: false,
    status: STATUS.ACTIVE,
    otp: {
      code: otpHash,
      expiresAt,
      attempts: 0,
    },
  });

  // Send OTP Email
  try {
    await sendEmail({
      to: customer.email,
      subject: "Verify your email - OTP Code",
      text: `Your email verification code is: ${otp}. Valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Our Store, ${customer.name}!</h2>
          <p>Your email verification OTP code is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }

  return {
    message: "Registration successful. Please verify your email with the OTP sent.",
    userId: customer._id,
    email: customer.email,
  };
};

/**
 * Customer Login
 */
export const login = async (email, password, meta = {}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const customer = await Customer.findByEmailWithPassword(normalizedEmail);

  if (!customer || customer.isDeleted) {
    throw new AppError(MESSAGES.AUTH.LOGIN_FAILED || "Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
  }

  if (customer.status !== STATUS.ACTIVE) {
    throw new AppError("Your account has been deactivated or suspended.", HTTP_STATUS.FORBIDDEN);
  }

  const isMatch = await customer.comparePassword(password);
  if (!isMatch) {
    throw new AppError(MESSAGES.AUTH.LOGIN_FAILED || "Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
  }

  if (!customer.isVerified) {
    throw new AppError(MESSAGES.AUTH.ACCOUNT_NOT_VERIFIED || "Please verify your email before logging in.", HTTP_STATUS.FORBIDDEN);
  }

  const tokenPayload = { id: customer._id, role: "customer", email: customer.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token
  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    await Token.create({
      userId: customer._id,
      tokenHash,
      expiresAt,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });
  } catch (e) {
    console.warn("Failed to store token record:", e.message);
  }

  await customer.recordLogin(meta.ip);

  return {
    message: MESSAGES.AUTH.LOGIN_SUCCESS || "Logged in successfully.",
    accessToken,
    refreshToken,
    customer: sanitizeCustomer(customer),
  };
};

/**
 * Verify Email OTP
 */
export const verifyOtp = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();
  const customer = await Customer.findOne({ email: normalizedEmail }).select(
    "+otp.code +otp.expiresAt +otp.attempts +isVerified"
  );

  if (!customer) {
    throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND || "Customer not found.", HTTP_STATUS.NOT_FOUND);
  }

  if (!customer.otp?.code || !customer.otp?.expiresAt) {
    throw new AppError(MESSAGES.AUTH.OTP_INVALID || "No active OTP found. Please request a new one.", HTTP_STATUS.BAD_REQUEST);
  }

  if (customer.otp.expiresAt < new Date()) {
    customer.otp = { code: null, expiresAt: null, attempts: 0 };
    await customer.save();
    throw new AppError(MESSAGES.AUTH.OTP_INVALID || "OTP has expired. Please request a new one.", HTTP_STATUS.BAD_REQUEST);
  }

  if (customer.otp.attempts >= 5) {
    customer.otp = { code: null, expiresAt: null, attempts: 0 };
    await customer.save();
    throw new AppError("Too many failed attempts. Please request a new OTP.", HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  const hashedInputOtp = crypto.createHash("sha256").update(otp).digest("hex");
  if (hashedInputOtp !== customer.otp.code) {
    customer.otp.attempts += 1;
    await customer.save();
    throw new AppError(MESSAGES.AUTH.OTP_INVALID || "Invalid OTP code.", HTTP_STATUS.BAD_REQUEST);
  }

  customer.isVerified = true;
  customer.otp = { code: null, expiresAt: null, attempts: 0 };
  await customer.save();

  const tokenPayload = { id: customer._id, role: "customer", email: customer.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    message: MESSAGES.AUTH.OTP_VERIFIED || "Email verified successfully.",
    accessToken,
    refreshToken,
    userId: customer._id,
    customer: sanitizeCustomer(customer),
  };
};

/**
 * Resend Verification OTP
 */
export const resendOtp = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const customer = await Customer.findOne({ email: normalizedEmail });

  if (!customer) {
    throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND || "Customer not found.", HTTP_STATUS.NOT_FOUND);
  }

  const { otp, otpHash } = generateOtp(6);
  const expiresAt = generateOtpExpiry(10);

  customer.otp = {
    code: otpHash,
    expiresAt,
    attempts: 0,
  };
  await customer.save();

  try {
    await sendEmail({
      to: customer.email,
      subject: "Resend Email Verification OTP",
      text: `Your new verification code is: ${otp}. Valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification OTP</h2>
          <p>Your new OTP code is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send resend OTP email:", err.message);
  }

  return {
    message: MESSAGES.AUTH.OTP_RESENT || "A new OTP has been sent to your email.",
  };
};

/**
 * Forgot Password (Sends OTP)
 */
export const forgotPassword = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const customer = await Customer.findOne({ email: normalizedEmail });

  if (!customer) {
    return {
      message: MESSAGES.AUTH.PASSWORD_RESET_LINK_SENT || "If an account with that email exists, an OTP has been sent.",
    };
  }

  const { otp, otpHash } = generateOtp(6);
  const expiresAt = generateOtpExpiry(10);

  customer.otp = {
    code: otpHash,
    expiresAt,
    attempts: 0,
  };
  await customer.save();

  try {
    await sendEmail({
      to: customer.email,
      subject: "Password Reset OTP Code",
      text: `Your password reset code is: ${otp}. Valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Your password reset OTP code is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send forgot password email:", err.message);
  }

  return {
    message: MESSAGES.AUTH.PASSWORD_RESET_LINK_SENT || "If an account with that email exists, an OTP has been sent.",
  };
};

/**
 * Reset Password with OTP
 */
export const resetPasswordWithOtp = async (email, otp, newPassword) => {
  const normalizedEmail = email.toLowerCase().trim();
  const customer = await Customer.findOne({ email: normalizedEmail }).select(
    "+otp.code +otp.expiresAt +otp.attempts"
  );

  if (!customer || !customer.otp?.code) {
    throw new AppError(MESSAGES.AUTH.OTP_INVALID || "Invalid or expired OTP request.", HTTP_STATUS.BAD_REQUEST);
  }

  if (customer.otp.expiresAt < new Date()) {
    customer.otp = { code: null, expiresAt: null, attempts: 0 };
    await customer.save();
    throw new AppError("OTP has expired. Please request a new one.", HTTP_STATUS.BAD_REQUEST);
  }

  const hashedInputOtp = crypto.createHash("sha256").update(otp).digest("hex");
  if (hashedInputOtp !== customer.otp.code) {
    customer.otp.attempts += 1;
    await customer.save();
    throw new AppError(MESSAGES.AUTH.OTP_INVALID || "Incorrect OTP code.", HTTP_STATUS.BAD_REQUEST);
  }

  customer.password = newPassword; // pre-save hook will hash
  customer.isVerified = true;
  customer.otp = { code: null, expiresAt: null, attempts: 0 };
  await customer.save();

  return { message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESS || "Password reset successfully. Please log in." };
};

/**
 * Reset Password with Token/OTP
 */
export const resetPassword = async ({ email, token, otp, newPassword }) => {
  const codeToVerify = otp || token;
  if (!codeToVerify || !email) {
    throw new AppError("Email and OTP/token are required.", HTTP_STATUS.BAD_REQUEST);
  }
  return resetPasswordWithOtp(email, codeToVerify, newPassword);
};

/**
 * Refresh Token
 */
export const refreshAccessToken = async (rawRefreshToken, meta = {}) => {
  if (!rawRefreshToken) {
    throw new AppError(MESSAGES.AUTH.TOKEN_MISSING || "Refresh token required.", HTTP_STATUS.UNAUTHORIZED);
  }

  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch (err) {
    throw new AppError(MESSAGES.AUTH.TOKEN_INVALID || "Invalid or expired refresh token.", HTTP_STATUS.UNAUTHORIZED);
  }

  const customer = await Customer.findById(payload.id);
  if (!customer || customer.status !== STATUS.ACTIVE || customer.isDeleted) {
    throw new AppError("Customer account not active.", HTTP_STATUS.UNAUTHORIZED);
  }

  const tokenPayload = { id: customer._id, role: "customer", email: customer.email };
  const accessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken: newRefreshToken,
    customer: sanitizeCustomer(customer),
  };
};

/**
 * Logout
 */
export const logout = async (rawRefreshToken, customerId) => {
  if (rawRefreshToken) {
    const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
    try {
      await Token.findOneAndUpdate({ tokenHash }, { isRevoked: true });
    } catch (_) {}
  }
  return { message: MESSAGES.AUTH.LOGOUT_SUCCESS || "Logged out successfully." };
};

/**
 * Change Password (Protected)
 */
export const changePassword = async (customerId, currentPassword, newPassword) => {
  const customer = await Customer.findById(customerId).select("+password");
  if (!customer) {
    throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND || "Customer not found.", HTTP_STATUS.NOT_FOUND);
  }

  const isMatch = await customer.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Current password is incorrect.", HTTP_STATUS.UNAUTHORIZED);
  }

  customer.password = newPassword; // pre-save hook hashes
  await customer.save();

  return { message: MESSAGES.AUTH.PASSWORD_CHANGED || "Password changed successfully." };
};

/**
 * Get Current Customer Profile (Get Me)
 */
export const getMe = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND || "Customer not found.", HTTP_STATUS.NOT_FOUND);
  }
  return sanitizeCustomer(customer);
};
