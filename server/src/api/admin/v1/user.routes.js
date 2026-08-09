// api/admin/v1/user.routes.js

import express from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUserById,
  deleteUserById,
  resetPassword,
} from "../../../modules/user/user.controller.js";
import {
  protect,
  restrictTo,
  checkPermission,
  authenticate,
} from "../../../middleware/auth.middleware.js";
// import validate from "../../../middleware/validate.middleware.js";
// import {
//   createUserSchema,
//   updateUserSchema,
// } from "../../../modules/user/user.validation.js";
import { PERMISSIONS } from "../../../constants/permissions.js";

const router = express.Router();



// ── All routes require authentication ─────────────────────────────────────────
router.use(protect);

// ── GET /api/admin/v1/users ───────────────────────────────────────────────────
router.get(
  "/",
  authenticate,
  // restrictTo("superadmin", "admin", "seller"),
  checkPermission(PERMISSIONS.USER.READ),
  getAllUsers
);

// ── POST /api/admin/v1/users ──────────────────────────────────────────────────
router.post(
  "/",
  // restrictTo("superadmin", "admin", "seller"),
  checkPermission(PERMISSIONS.USER.CREATE),
//   validate(createUserSchema),
  createUser
);

// ── GET /api/admin/v1/users/:id ───────────────────────────────────────────────
router.get(
  "/:id",
  // restrictTo("superadmin", "admin", "seller"),
  checkPermission(PERMISSIONS.USER.READ),
  getUser
);

// ── PUT /api/admin/v1/users/:id ───────────────────────────────────────────────
router.put(
  "/:id",
  // restrictTo("superadmin", "admin", "seller"),
  checkPermission(PERMISSIONS.USER.UPDATE),
//   validate(updateUserSchema),
  updateUserById
);

// ── DELETE /api/admin/v1/users/:id ────────────────────────────────────────────
router.delete(
  "/:id",
  restrictTo("superadmin"),
  checkPermission(PERMISSIONS.USER.DELETE),
  deleteUserById
);

// ── POST /api/admin/v1/users/:id/reset-password ───────────────────────────────
router.post(
  "/:id/reset-password",
  // restrictTo("superadmin", "admin", "seller"),
  checkPermission(PERMISSIONS.USER.RESET_PASSWORD),
  resetPassword
);

export default router;