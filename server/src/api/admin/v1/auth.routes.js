/**
 * src/api/admin/v1/auth.routes.js
 * Base: /api/admin/v1/auth
 */

import express       from "express";
import {
  login,
  changeFirstLoginPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  logoutAll,
  getMe,
}                    from "../../../modules/auth/auth.controller.js";
import {
  protect,
  protectFirstLogin,
}                    from "../../../middleware/auth.middleware.js";
import {validate }     from "../../../middleware/validate.middleware.js";
import {rateLimiter }  from "../../../middleware/rateLimit.middleware.js";
import {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
}                    from "../../../modules/auth/auth.validation.js";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/login",           rateLimiter({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "admin_login" }), validate(loginSchema), login);
router.post("/forgot-password", rateLimiter({ windowMs: 60 * 60 * 1000, max: 5,  keyPrefix: "admin_forgot" }), validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password",  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5,  keyPrefix: "admin_reset" }),  validate(resetPasswordSchema),  resetPassword);
router.post("/refresh-token",   refreshToken);

// ── First-login guard ─────────────────────────────────────────────────────────
router.post("/change-first-login-password", protectFirstLogin, validate(changePasswordSchema), changeFirstLoginPassword);

// ── Protected ─────────────────────────────────────────────────────────────────
router.use(protect);

router.get("/me",              getMe);
router.put("/change-password", validate(changePasswordSchema), changePassword);
router.post("/logout",         logout);
router.post("/logout-all",     logoutAll);

export default router;