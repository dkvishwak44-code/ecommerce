/**
 * Client Auth Routes
 * Base: /api/client/v1/auth
 *
 * Public & protected routes for Customer authentication (storefront).
 * All handlers use Customer model via customerAuth.controller.js.
 */

import { Router } from "express";
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  resetPasswordWithOtp,
  refreshToken,
  logout,
  changePassword,
  getMe,
} from "../../../modules/customer/customerAuth.controller.js";

import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { rateLimiter } from "../../../middleware/rateLimit.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../../../modules/auth/auth.validation.js";

const router = Router();

// ── Public Endpoints ──────────────────────────────────────────────────────────
router.post(
  "/register",
  rateLimiter(),
  //  validate(registerSchema),
  register,
);
router.post("/login", rateLimiter(), validate(loginSchema), login);
router.post("/verify-otp", rateLimiter(), validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", rateLimiter(), resendOtp);
router.post(
  "/forgot-password",
  rateLimiter(),
  validate(forgotPasswordSchema),
  forgotPassword,
);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/reset-password-with-otp", resetPasswordWithOtp);
router.post("/refresh-token", refreshToken);

// ── Protected Endpoints (Requires valid Customer JWT Token) ────────────────────
router.get("/me", customerAuthenticate, getMe);
router.post("/logout", customerAuthenticate, logout);
router.patch(
  "/change-password",
  customerAuthenticate,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
