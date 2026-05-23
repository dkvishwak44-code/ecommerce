import crypto from "crypto";
import authRepository from "./auth.repository.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { emitAuthEvent } from "./auth.events.js";
import { AppError } from "../../utils/AppError.js";
import { logger } from "../../config/logger.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_LOGIN_ATTEMPTS        = 5;
const LOCK_TIME_MS              = 15 * 60 * 1000;
const OTP_MAX_ATTEMPTS          = 3;
const OTP_EXPIRY_MS             = 10 * 60 * 1000;
const RESET_TOKEN_EXPIRY_MS     = 60 * 60 * 1000;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

class AuthService {

  constructor() {
    // ── Bind all public methods so `this` is never lost when destructured ──────
    this.login                    = this.login.bind(this);
    this.register                 = this.register.bind(this);
    this.changeFirstLoginPassword = this.changeFirstLoginPassword.bind(this);
    this.changePassword           = this.changePassword.bind(this);
    this.forgotPassword           = this.forgotPassword.bind(this);
    this.resetPassword            = this.resetPassword.bind(this);
    this.sendOtp                  = this.sendOtp.bind(this);
    this.verifyOtp                = this.verifyOtp.bind(this);
    this.refreshAccessToken       = this.refreshAccessToken.bind(this);
    this.logout                   = this.logout.bind(this);
    this.logoutAll                = this.logoutAll.bind(this);
    this.getMe                    = this.getMe.bind(this);
  }

  // ─── Login ────────────────────────────────────────────────────────────────────

  async login(email, password, meta = {}) {
    const user = await authRepository.findUserByEmailWithPassword(email);

    if (!user) throw new AppError("Invalid email or password", 401);

    if (!user.isActive) {
      throw new AppError("Your account has been deactivated. Please contact support.", 403);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      await this._handleFailedLogin(user);
      throw new AppError("Invalid email or password", 401);
    }

    await authRepository.resetLoginAttempts(user._id);
    await authRepository.setLastLogin(user._id);

    if (user.isFirstLogin) {
      logger.info(`First login detected for user: ${user._id}`);
      const firstLoginToken = generateAccessToken(
        { id: user._id, scope: "change_password" },
        "15m"
      );
      emitAuthEvent("auth:first_login", { userId: user._id });
      return {
        isFirstLogin: true,
        message: "You are using a system-generated password. Please change your password to continue.",
        firstLoginToken,
      };
    }

    if (!user.isEmailVerified) {
      throw new AppError("Please verify your email address before logging in.", 403);
    }
    console.log("++++++++++++++++++++++++++++",user);

    const { accessToken, refreshToken } = await this._generateTokenPair(user);
    // console.log("access token :",accessToken,"refresh token : ",refreshToken);

    emitAuthEvent("auth:login", { userId: user._id, ip: meta.ip });
    logger.info(`User logged in: ${user._id}`);

    return {
      isFirstLogin: false,
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
      user: this._sanitizeUser(user),
    };
  }

  // ─── Register ─────────────────────────────────────────────────────────────────

  async register({ firstName, lastName, email, password, phone }) {
    const existing = await authRepository.findUserByEmail(email);
    if (existing) throw new AppError("An account with this email already exists.", 409);

    const hashedPassword = await hashPassword(password);
    const { default: User } = await import("../user/user.model.js");

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "customer",
      isActive: true,
      isEmailVerified: false,
      isFirstLogin: false,
    });

    const { otp, otpHash } = await generateOtp();
    const expires = new Date(Date.now() + OTP_EXPIRY_MS);
    await authRepository.setOtp(user._id, otpHash, expires);

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        template: "otp",
        data: { name: firstName, otp, expiresIn: "10 minutes", purpose: "verification" },
      });
    } catch (err) {
      logger.error(`Failed to send verification email to ${email}: ${err.message}`);
    }

    emitAuthEvent("auth:register", { userId: user._id });
    logger.info(`New customer registered: ${email}`);

    return {
      message: "Registration successful. Please verify your email with the OTP sent.",
      userId: user._id,
      email: user.email,
    };
  }

  // ─── Change Password (First Login) ───────────────────────────────────────────

  async changeFirstLoginPassword(userId, currentPassword, newPassword, meta = {}) {
    const user = await authRepository.findUserByIdWithPassword(userId);
    if (!user) throw new AppError("User not found", 404);

    if (!user.isFirstLogin) {
      throw new AppError("Password has already been changed. Please use the forgot password flow if needed.", 400);
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) throw new AppError("Current password is incorrect", 401);

    const isSame = await comparePassword(newPassword, user.password);
    if (isSame) throw new AppError("New password cannot be the same as the current password", 400);

    const hashedPassword = await hashPassword(newPassword);
    await authRepository.updateUserPassword(user._id, hashedPassword);
    await authRepository.revokeAllUserTokens(user._id);

    const { accessToken, refreshToken } = await this._generateTokenPair(user, meta);

    emitAuthEvent("auth:password_changed_first_login", { userId: user._id });
    logger.info(`First-login password changed for user: ${user._id}`);

    return {
      message: "Password changed successfully. Welcome!",
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
      user: this._sanitizeUser(user),
    };
  }

  // ─── Change Password (Authenticated) ─────────────────────────────────────────

  async changePassword(userId, currentPassword, newPassword) {
    const user = await authRepository.findUserByIdWithPassword(userId);
    if (!user) throw new AppError("User not found", 404);

    if (user.isFirstLogin) {
      throw new AppError("Please use the first-login password change endpoint", 400);
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) throw new AppError("Current password is incorrect", 401);

    const isSame = await comparePassword(newPassword, user.password);
    if (isSame) throw new AppError("New password cannot be the same as the current password", 400);

    const hashedPassword = await hashPassword(newPassword);
    await authRepository.updateUserPassword(user._id, hashedPassword);
    await authRepository.revokeAllUserTokens(user._id);

    emitAuthEvent("auth:password_changed", { userId: user._id });
    logger.info(`Password changed for user: ${user._id}`);

    return { message: "Password updated successfully. Please log in again." };
  }

  // ─── Forgot Password ──────────────────────────────────────────────────────────

  async forgotPassword(email) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      return { message: "If an account with that email exists, a reset link has been sent." };
    }

    const rawToken    = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires     = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await authRepository.setPasswordResetToken(user._id, hashedToken, expires);

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        template: "resetPassword",
        data: { name: user.name, resetUrl, expiresIn: "1 hour" },
      });
    } catch (err) {
      await authRepository.setPasswordResetToken(user._id, undefined, undefined);
      logger.error(`Failed to send reset email to ${email}: ${err.message}`);
      throw new AppError("Failed to send reset email. Please try again later.", 500);
    }

    logger.info(`Password reset token sent to: ${email}`);
    return { message: "If an account with that email exists, a reset link has been sent." };
  }

  // ─── Reset Password ───────────────────────────────────────────────────────────

  async resetPassword(rawToken, newPassword) {
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const user = await authRepository.findUserByResetToken(hashedToken);
    if (!user) throw new AppError("Invalid or expired password reset token", 400);

    const isSame = await comparePassword(newPassword, user.password);
    if (isSame) throw new AppError("New password cannot be the same as the current password", 400);

    const hashedPassword = await hashPassword(newPassword);
    await authRepository.updateUserPassword(user._id, hashedPassword);
    await authRepository.revokeAllUserTokens(user._id);

    emitAuthEvent("auth:password_reset", { userId: user._id });
    logger.info(`Password reset completed for user: ${user._id}`);

    return { message: "Password reset successful. Please log in." };
  }

  // ─── Send OTP ─────────────────────────────────────────────────────────────────

  async sendOtp(email, purpose = "verification") {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throw new AppError("User not found", 404);

    const { otp, otpHash } = await generateOtp();
    const expires = new Date(Date.now() + OTP_EXPIRY_MS);

    await authRepository.setOtp(user._id, otpHash, expires);

    try {
      await sendEmail({
        to: user.email,
        subject: purpose === "verification" ? "Your Verification Code" : "Your OTP",
        template: "otp",
        data: { name: user.name, otp, expiresIn: "10 minutes", purpose },
      });
    } catch (err) {
      logger.error(`Failed to send OTP to ${email}: ${err.message}`);
      throw new AppError("Failed to send OTP. Please try again.", 500);
    }

    logger.info(`OTP sent to: ${email} for purpose: ${purpose}`);
    return { message: "OTP sent successfully" };
  }

  // ─── Verify OTP ───────────────────────────────────────────────────────────────

  async verifyOtp(email, otp) {
    const user = await authRepository.findUserByOtp(email);
    if (!user) throw new AppError("User not found", 404);

    if (!user.otp || !user.otpExpires) {
      throw new AppError("No OTP found. Please request a new one.", 400);
    }

    if (user.otpExpires < new Date()) {
      await authRepository.clearOtp(user._id);
      throw new AppError("OTP has expired. Please request a new one.", 400);
    }

    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      await authRepository.clearOtp(user._id);
      throw new AppError("Too many OTP attempts. Please request a new one.", 429);
    }

    const isValid = await comparePassword(otp, user.otp);
    if (!isValid) {
      await authRepository.incrementOtpAttempts(user._id);
      const remaining = OTP_MAX_ATTEMPTS - (user.otpAttempts + 1);
      throw new AppError(`Invalid OTP. ${remaining} attempt(s) remaining.`, 400);
    }

    await authRepository.clearOtp(user._id);
    await authRepository.markEmailVerified(user._id);

    logger.info(`OTP verified for user: ${user._id}`);
    return { message: "OTP verified successfully", userId: user._id };
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────────

  async refreshAccessToken(rawRefreshToken, meta = {}) {
    let payload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch (err) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const tokenHash   = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
    const storedToken = await authRepository.findRefreshToken(tokenHash);

    if (!storedToken || storedToken.isRevoked) {
      throw new AppError("Refresh token has been revoked. Please log in again.", 401);
    }

    if (storedToken.expiresAt < new Date()) {
      await authRepository.revokeRefreshToken(tokenHash);
      throw new AppError("Refresh token has expired. Please log in again.", 401);
    }

    await authRepository.revokeRefreshToken(tokenHash);

    const user = await authRepository.findUserById(payload.id);
    if (!user || !user.isActive) {
      throw new AppError("User not found or account deactivated", 401);
    }

    const { accessToken, refreshToken } = await this._generateTokenPair(user, meta);

    logger.info(`Token refreshed for user: ${user._id}`);
    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    };
  }

  // ─── Logout ───────────────────────────────────────────────────────────────────

  async logout(rawRefreshToken, userId) {
    if (rawRefreshToken) {
      const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
      await authRepository.revokeRefreshToken(tokenHash);
    }
    emitAuthEvent("auth:logout", { userId });
    logger.info(`User logged out: ${userId}`);
    return { message: "Logged out successfully" };
  }

  async logoutAll(userId) {
    await authRepository.revokeAllUserTokens(userId);
    emitAuthEvent("auth:logout_all", { userId });
    logger.info(`All sessions revoked for user: ${userId}`);
    return { message: "Logged out from all devices" };
  }

  // ─── Get Me ───────────────────────────────────────────────────────────────────

  async getMe(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new AppError("User not found", 404);
    return this._sanitizeUser(user);
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────────

  async _handleFailedLogin(user) {
    const attempts = (user.loginAttempts || 0) + 1;
    await authRepository.incrementLoginAttempts(user._id);

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      await authRepository.lockUserAccount(user._id, lockUntil);
      logger.warn(`Account locked due to failed attempts: ${user._id}`);
      emitAuthEvent("auth:account_locked", { userId: user._id });
    }
  }

  async _generateTokenPair(user, meta = {}) {
    const payload          = { id: user._id, role: user.role,roleName:user.roleName };
    const accessToken      = generateAccessToken(payload);
    const rawRefreshToken  = generateRefreshToken(payload);
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(rawRefreshToken)
      .digest("hex");
    const refreshExpiry = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    await authRepository.saveRefreshToken(user._id, refreshTokenHash, refreshExpiry, {
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      refreshTokenHash,
      refreshExpiry,
    };
  }

  _sanitizeUser(user) {
    const {
      password,
      otp,
      otpExpires,
      otpAttempts,
      loginAttempts,
      lockUntil,
      passwordResetToken,
      passwordResetExpires,
      emailVerificationToken,
      emailVerificationExpires,
      ...safe
    } = user.toObject ? user.toObject() : user;
    return safe;
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

const authService = new AuthService();

export default authService;

//  Named exports as bound wrapper functions — this context is preserved
export const login                    = (...args) => authService.login(...args);
export const register                 = (...args) => authService.register(...args);
export const changeFirstLoginPassword = (...args) => authService.changeFirstLoginPassword(...args);
export const changePassword           = (...args) => authService.changePassword(...args);
export const forgotPassword           = (...args) => authService.forgotPassword(...args);
export const resetPassword            = (...args) => authService.resetPassword(...args);
export const sendOtp                  = (...args) => authService.sendOtp(...args);
export const verifyOtp                = (...args) => authService.verifyOtp(...args);
export const refreshAccessToken       = (...args) => authService.refreshAccessToken(...args);
export const logout                   = (...args) => authService.logout(...args);
export const logoutAll                = (...args) => authService.logoutAll(...args);
export const getMe                    = (...args) => authService.getMe(...args);