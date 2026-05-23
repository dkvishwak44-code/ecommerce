/**
 * Client Auth Routes
 * Base: /api/client/v1/auth
 *
 * Public routes — no authentication required unless noted.
 * Rate limiting applied on sensitive endpoints (OTP, login, register).
 */

import { Router } from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../../../modules/auth/auth.controller.js";

// import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
// import {customerAuthenticate } from "../../../middleware/customerAuth.middleware.js
//"

import { validate }             from "../../../middleware/validate.middleware.js";
import { rateLimiter }          from "../../../middleware/rateLimit.middleware.js";
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../../../modules/auth/auth.validation.js";
import { customerOptionalAuth } from "../../../middleware/customerAuth.middleware.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/register",         rateLimiter("register"),  validate(registerSchema),         register);
router.post("/verify-otp",       rateLimiter("otp"),       validate(verifyOtpSchema),        verifyOtp);
router.post("/resend-otp",       rateLimiter("otp"),       validate(verifyOtpSchema),        resendOtp);
router.post("/login",            rateLimiter("login"),     validate(loginSchema),            login);
router.post("/refresh-token",                                                                refreshToken);
router.post("/forgot-password",  rateLimiter("otp"),       validate(forgotPasswordSchema),   forgotPassword);
router.post("/reset-password",                             validate(resetPasswordSchema),    resetPassword);

// ── Protected (customer must be logged in) ────────────────────────────────────
router.post("/logout",           customerAuthenticate,                                       logout);
router.patch("/change-password", customerAuthenticate, validate(changePasswordSchema),       changePassword);

export {router as authRoutes};