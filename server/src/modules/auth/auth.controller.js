// const authService = require("./auth.service");
// const asyncHandler = require("../../utils/asyncHandler");
// const { sendSuccess } = require("../../utils/response");
import {sendSuccess } from "../../utils/response.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";







// ─── Register ─────────────────────────────────────────────────────────────────
const register = async({ firstName, lastName, email, password, phone }) =>{
  // 1. Check duplicate email
  const existing = await authRepository.findUserByEmail(email);
  if (existing) {
    throw new AppError("An account with this email already exists.", 409);
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(password);

  // 3. Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    role: "customer",
    isActive: true,
    isEmailVerified: false,
    isFirstLogin: false, // self-registered — no system password
  });

  // 4. Send OTP for email verification
  const { otp, otpHash } = await generateOtp();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await authRepository.setOtp(user._id, otpHash, expires);

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    template: "otp",
    data: {
      name: firstName,
      otp,
      expiresIn: "10 minutes",
      purpose: "verification",
    },
  });

  emitAuthEvent("auth:register", { userId: user._id });
  logger.info(`New customer registered: ${email}`);

  return {
    message: "Registration successful. Please verify your email with the OTP sent.",
    userId: user._id,
    email: user.email,
  };
}
// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * @route  POST /api/admin/v1/auth/login
 * @route  POST /api/client/v1/auth/login
 * @access Public
 *
 * Response variants:
 *  - isFirstLogin: true  → returns firstLoginToken + prompt to change password
 *  - isFirstLogin: false → returns accessToken + refreshToken
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const meta = {
    ip: req.ip || req.headers["x-forwarded-for"],
    userAgent: req.headers["user-agent"],
  };

  const result = await authService.login(email, password, meta);

  
  // Set refresh token as httpOnly cookie if full login
  if (!result.isFirstLogin && result.refreshToken) {
    _setRefreshTokenCookie(res, result.refreshToken);
    delete result.refreshToken; // Don't expose in body
  }

  const statusCode = result.isFirstLogin ? 200 : 200;
  return sendSuccess(res, {result, message : result.message || "Login successful", statusCode});
});

// ─── Change Password — First Login ────────────────────────────────────────────

/**
 * @route  POST /api/admin/v1/auth/change-first-login-password
 * @route  POST /api/client/v1/auth/change-first-login-password
 * @access Protected (firstLoginToken scope: change_password)
 *
 * Called when isFirstLogin=true. Uses the short-lived firstLoginToken.
 * On success, issues full accessToken + refreshToken and sets isFirstLogin=false.
 */
const changeFirstLoginPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const meta = {
    ip: req.ip || req.headers["x-forwarded-for"],
    userAgent: req.headers["user-agent"],
  };

  const result = await authService.changeFirstLoginPassword(
    req.user.id,
    currentPassword,
    newPassword,
    meta
  );

  if (result.refreshToken) {
    _setRefreshTokenCookie(res, result.refreshToken);
    delete result.refreshToken;
  }

  return sendSuccess(res, result, result.message, 200);
});

// ─── Change Password (Regular) ────────────────────────────────────────────────

/**
 * @route  PUT /api/admin/v1/auth/change-password
 * @route  PUT /api/client/v1/auth/change-password
 * @access Protected
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );
  return sendSuccess(res, null, result.message, 200);
});

// ─── Forgot Password ──────────────────────────────────────────────────────────

/**
 * @route  POST /api/admin/v1/auth/forgot-password
 * @route  POST /api/client/v1/auth/forgot-password
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  return sendSuccess(res, null, result.message, 200);
});

// ─── Reset Password ───────────────────────────────────────────────────────────

/**
 * @route  POST /api/admin/v1/auth/reset-password
 * @route  POST /api/client/v1/auth/reset-password
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  return sendSuccess(res, null, result.message, 200);
});

// ─── Send OTP ─────────────────────────────────────────────────────────────────

/**
 * @route  POST /api/client/v1/auth/send-otp
 * @access Public
 */
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.sendOtp(email);
  return sendSuccess(res, null, result.message, 200);
});

// ─── Verify OTP ───────────────────────────────────────────────────────────────

/**
 * @route  POST /api/client/v1/auth/verify-otp
 * @access Public
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOtp(email, otp);
  return sendSuccess(res, { userId: result.userId }, result.message, 200);
});

// ─── Resend OTP ───────────────────────────────────────────────────────────────

/**
 * @route  POST /api/client/v1/auth/resend-otp
 * @access Public
 */
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.sendOtp(email, "verification");
  return sendSuccess(res, null, result.message, 200);
});

// ─── Refresh Token ────────────────────────────────────────────────────────────

/**
 * @route  POST /api/admin/v1/auth/refresh-token
 * @route  POST /api/client/v1/auth/refresh-token
 * @access Public (requires valid refreshToken in cookie or body)
 */
const refreshToken = asyncHandler(async (req, res) => {
  // Prefer cookie, fallback to body
  const rawToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!rawToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not provided",
    });
  }

  const meta = {
    ip: req.ip || req.headers["x-forwarded-for"],
    userAgent: req.headers["user-agent"],
  };

  const result = await authService.refreshAccessToken(rawToken, meta);

  _setRefreshTokenCookie(res, result.refreshToken);
  delete result.refreshToken;

  return sendSuccess(res, result, "Token refreshed successfully", 200);
});

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * @route  POST /api/admin/v1/auth/logout
 * @route  POST /api/client/v1/auth/logout
 * @access Protected
 */
const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
  await authService.logout(rawToken, req.user?.id);
  res.clearCookie("refreshToken", _cookieOptions());
  return sendSuccess(res, null, "Logged out successfully", 200);
});

// ─── Logout All ───────────────────────────────────────────────────────────────

/**
 * @route  POST /api/admin/v1/auth/logout-all
 * @route  POST /api/client/v1/auth/logout-all
 * @access Protected
 */
const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id);
  res.clearCookie("refreshToken", _cookieOptions());
  return sendSuccess(res, null, "Logged out from all devices", 200);
});

// ─── Get Me ───────────────────────────────────────────────────────────────────

/**
 * @route  GET /api/admin/v1/auth/me
 * @route  GET /api/client/v1/auth/me
 * @access Protected
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return sendSuccess(res, { user }, "User fetched successfully", 200);
});

// ─── Private Helpers ──────────────────────────────────────────────────────────

function _cookieOptions(maxAgeMs = 7 * 24 * 60 * 60 * 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: maxAgeMs,
    path: "/",
  };
}

function _setRefreshTokenCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, _cookieOptions());
}

export {
  login,
  changeFirstLoginPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  register,
  sendOtp,
  verifyOtp,
  resendOtp,
  refreshToken,
  logout,
  logoutAll,
  getMe,
};