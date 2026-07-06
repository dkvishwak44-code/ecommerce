import { Router } from "express";
import * as controller from "./role.controller.js";
import { authenticate, checkPermission } from "../../../middleware/auth.middleware.js";
// import { checkPermission } from "../../../middleware/permission.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  createRoleSchema,
  updateRoleSchema,
  assignPermissionsSchema,
  bulkUpdateStatusSchema,
} from "./role.validation.js";
import { PERMISSIONS } from "../../../constants/permissions.js";

const router = Router();

// ───────────────────────────────────────────────────────────────
// Protect all routes - require authentication & permission check
// ───────────────────────────────────────────────────────────────
router.use(authenticate);

// ───────────────────────────────────────────────────────────────
// GET ROUTES
// ───────────────────────────────────────────────────────────────

/**
 * Get default role
 * GET /admin/roles/default
 */
router.get(
  "/default",
  checkPermission("role.read"),
  controller.getDefaultRole
);

/**
 * Get system roles
 * GET /admin/roles/system/list
 */
router.get(
  "/system/list",
  checkPermission("role.read_all"),
  controller.getSystemRoles
);

/**
 * Get all roles
 * GET /admin/roles
 */
router.get(
  "/",
  checkPermission("role.read_all"),
  controller.getAllRoles
);

/**
 * Get role by ID
 * GET /admin/roles/:id
 */
router.get(
  "/:id",
  checkPermission("role.read"),
  controller.getRoleById
);

// ───────────────────────────────────────────────────────────────
// POST ROUTES
// ───────────────────────────────────────────────────────────────

/**
 * Create role
 * POST /admin/roles
 */
router.post(
  "/",
  checkPermission(PERMISSIONS.ROLE.CREATE),
//   validate(createRoleSchema),
  controller.createRole
);

// ───────────────────────────────────────────────────────────────
// PATCH ROUTES
// ───────────────────────────────────────────────────────────────

/**
 * Bulk update role status
 * PATCH /admin/roles/bulk/status
 */
router.patch(
  "/bulk/status",
  checkPermission("role.update"),
  validate(bulkUpdateStatusSchema),
  controller.bulkUpdateStatus
);

/**
 * Set role as default
 * PATCH /admin/roles/:id/set-default
 */
router.patch(
  "/:id/set-default",
  checkPermission("role.update"),
  controller.setDefaultRole
);

/**
 * Assign permissions to role
 * PATCH /admin/roles/:id/permissions
 */
router.patch(
  "/:id/permissions",
  checkPermission("role.assign_permissions"),
  validate(assignPermissionsSchema),
  controller.assignPermissions
);

/**
 * Update role
 * PATCH /admin/roles/:id
 */
router.patch(
  "/:id",
  checkPermission("role.update"),
  validate(updateRoleSchema),
  controller.updateRole
);

// ───────────────────────────────────────────────────────────────
// DELETE ROUTES
// ───────────────────────────────────────────────────────────────

/**
 * Delete role
 * DELETE /admin/roles/:id
 */
router.delete(
  "/:id",
  checkPermission("role.delete"),
  controller.deleteRole
);

export default router;
