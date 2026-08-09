import { Router } from "express";
import * as controller from "./role.controller.js";
// import { authenticate, checkPermission } from "../../../middleware/auth.middleware.js";
// import { checkPermission } from "../../../middleware/permission.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  createRoleSchema,
  updateRoleSchema,
  assignPermissionsSchema,
  bulkUpdateStatusSchema,
} from "./role.validation.js";
import { PERMISSIONS } from "../../../constants/permissions.js";
import { authenticate, checkPermission } from "../../../middleware/auth.middleware.js";

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
  checkPermission(PERMISSIONS.ROLE.READ),
  controller.getDefaultRole
);

/**
 * Get system roles
 * GET /admin/roles/system/list
 */
router.get(
  "/system/list",
  checkPermission(PERMISSIONS.ROLE.READ),
  controller.getSystemRoles
);

/**
 * Get all roles
 * GET /admin/roles
 */
router.get(
  "/",
  checkPermission(PERMISSIONS.ROLE.READ),
  controller.getAllRoles
);

/**
 * Get role by ID
 * GET /admin/roles/:id
 */
router.get(
  "/:id",
  checkPermission(PERMISSIONS.ROLE.READ),
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
  checkPermission(PERMISSIONS.ROLE.UPDATE),
  validate(bulkUpdateStatusSchema),
  controller.bulkUpdateStatus
);

/**
 * Set role as default
 * PATCH /admin/roles/:id/set-default
 */
router.patch(
  "/:id/set-default",
  checkPermission(PERMISSIONS.ROLE.UPDATE),
  controller.setDefaultRole
);

/**
 * Assign permissions to role
 * PATCH /admin/roles/:id/permissions
 */
router.patch(
  "/:id/permissions",
  checkPermission(PERMISSIONS.ROLE.ASSIGN_PERMISSIONS),
  validate(assignPermissionsSchema),
  controller.assignPermissions
);

/**
 * Update role
 * PATCH /admin/roles/:id
 */
router.patch(
  "/:id",
  checkPermission(PERMISSIONS.ROLE.UPDATE),
  // validate(updateRoleSchema),
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
  checkPermission(PERMISSIONS.ROLE.DELETE),
  controller.deleteRole
);

export default router;
