import { Router } from "express";
import * as controller from "./permission.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { checkPermission } from "../../../middleware/permission.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  createPermissionSchema,
  updatePermissionSchema,
  bulkUpdateStatusSchema,
} from "./permission.validation.js";

const router = Router();

// ───────────────────────────────────────────────────────────────
// Protect all routes - require authentication & permission check
// ───────────────────────────────────────────────────────────────
router.use(authenticate);

// ───────────────────────────────────────────────────────────────
// GET ROUTES
// ───────────────────────────────────────────────────────────────

/**
 * Get all modules
 * GET /admin/permissions/modules/list
 */
router.get(
  "/modules/list",
  checkPermission("permission.read_all"),
  controller.getModules
);

/**
 * Get permissions by module
 * GET /admin/permissions/module/:module
 */
router.get(
  "/module/:module",
  checkPermission("permission.read_all"),
  controller.getPermissionsByModule
);

/**
 * Get all permissions
 * GET /admin/permissions
 */
router.get(
  "/",
//   checkPermission("permission.read_all"),
  controller.getAllPermissions
);

/**
 * Get permission by ID
 * GET /admin/permissions/:id
 */
router.get(
  "/:id",
  checkPermission("permission.read"),
  controller.getPermissionById
);

// ───────────────────────────────────────────────────────────────
// POST ROUTES
// ───────────────────────────────────────────────────────────────

/**
 * Create permission
 * POST /admin/permissions
 */
router.post(
  "/",
  checkPermission("permission.create"),
  validate(createPermissionSchema),
  controller.createPermission
);

// ───────────────────────────────────────────────────────────────
// PATCH ROUTES
// ───────────────────────────────────────────────────────────────

/**
 * Bulk update permission status
 * PATCH /admin/permissions/bulk/status
 */
router.patch(
  "/bulk/status",
  checkPermission("permission.update"),
  validate(bulkUpdateStatusSchema),
  controller.bulkUpdateStatus
);

/**
 * Update permission
 * PATCH /admin/permissions/:id
 */
router.patch(
  "/:id",
  checkPermission("permission.update"),
  validate(updatePermissionSchema),
  controller.updatePermission
);

// ───────────────────────────────────────────────────────────────
// DELETE ROUTES
// ───────────────────────────────────────────────────────────────

/**
 * Delete permission
 * DELETE /admin/permissions/:id
 */
router.delete(
  "/:id",
  checkPermission("permission.delete"),
  controller.deletePermission
);

export default router;
