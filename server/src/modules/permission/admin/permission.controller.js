import * as service from "./permission.service.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";

/**
 * Create permission
 * POST /admin/permissions
 */
export const createPermission = asyncHandler(async (req, res) => {
  const permission = await service.createPermission(req);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Permission created successfully.",
    result: { permission },
  });
});

/**
 * Get all permissions
 * GET /admin/permissions
 */
export const getAllPermissions = asyncHandler(async (req, res) => {
  const result = await service.getAllPermissions(req);
  return sendSuccess(res, {
    message: "Permissions fetched successfully.",
    result,
  });
});

/**
 * Get permission by ID
 * GET /admin/permissions/:id
 */
export const getPermissionById = asyncHandler(async (req, res) => {
  const permission = await service.getPermissionById(req);
  return sendSuccess(res, {
    message: "Permission fetched successfully.",
    result: { permission },
  });
});

/**
 * Update permission
 * PATCH /admin/permissions/:id
 */
export const updatePermission = asyncHandler(async (req, res) => {
  const permission = await service.updatePermission(req);
  return sendSuccess(res, {
    message: "Permission updated successfully.",
    result: { permission },
  });
});

/**
 * Delete permission
 * DELETE /admin/permissions/:id
 */
export const deletePermission = asyncHandler(async (req, res) => {
  const result = await service.deletePermission(req);
  return sendSuccess(res, {
    message: result.message,
  });
});

/**
 * Bulk update permission status
 * PATCH /admin/permissions/bulk/status
 */
export const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const result = await service.bulkUpdateStatus(req);
  return sendSuccess(res, {
    message: result.message,
    result: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    },
  });
});

/**
 * Get permissions by module
 * GET /admin/permissions/module/:module
 */
export const getPermissionsByModule = asyncHandler(async (req, res) => {
  const result = await service.getPermissionsByModule(req);
  return sendSuccess(res, {
    message: "Permissions fetched successfully.",
    result,
  });
});

/**
 * Get all modules
 * GET /admin/permissions/modules/list
 */
export const getModules = asyncHandler(async (req, res) => {
  const result = await service.getModules(req);
  return sendSuccess(res, {
    message: "Modules fetched successfully.",
    result,
  });
});
