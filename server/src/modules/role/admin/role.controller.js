import * as service from "./role.service.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";

/**
 * Create role
 * POST /admin/roles
 */
export const createRole = asyncHandler(async (req, res) => {
    console.log("createRole called with req.body:++++++++", req); // Debugging line
  const role = await service.createRole(req);
  return sendSuccess(res, {
    message: "Role created successfully.",
    result: { role },
    statusCode: 201,
  });
});

/**
 * Get all roles
 * GET /admin/roles
 */
export const getAllRoles = asyncHandler(async (req, res) => {
  const result = await service.getAllRoles(req);
  return sendSuccess(res, {
    message: "Roles fetched successfully.",
    result,
    statusCode:200
  });
});

/**
 * Get role by ID
 * GET /admin/roles/:id
 */
export const getRoleById = asyncHandler(async (req, res) => {
  const role = await service.getRoleById(req);
  return sendSuccess(res, {
    message: "Role fetched successfully.",
    result: { role },
  });
});

/**
 * Update role
 * PATCH /admin/roles/:id
 */
export const updateRole = asyncHandler(async (req, res) => {
  const role = await service.updateRole(req);
  return sendSuccess(res, {
    message: "Role updated successfully.",
    result: { role },
  });
});

/**
 * Delete role
 * DELETE /admin/roles/:id
 */
export const deleteRole = asyncHandler(async (req, res) => {
  const result = await service.deleteRole(req);
  return sendSuccess(res, {
    message: result.message,
  });
});

/**
 * Assign permissions to role
 * PATCH /admin/roles/:id/permissions
 */
export const assignPermissions = asyncHandler(async (req, res) => {
  const role = await service.assignPermissions(req);
  return sendSuccess(res, {
    message: "Permissions assigned successfully.",
    result: { role },
  });
});

/**
 * Bulk update role status
 * PATCH /admin/roles/bulk/status
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
 * Get system roles
 * GET /admin/roles/system/list
 */
export const getSystemRoles = asyncHandler(async (req, res) => {
  const result = await service.getSystemRoles(req);
  return sendSuccess(res, {
    message: "System roles fetched successfully.",
    result,
  });
});

/**
 * Set role as default
 * PATCH /admin/roles/:id/set-default
 */
export const setDefaultRole = asyncHandler(async (req, res) => {
  const role = await service.setDefaultRole(req);
  return sendSuccess(res, {
    message: "Role set as default successfully.",
    result: { role },
  });
});

/**
 * Get default role
 * GET /admin/roles/default
 */
export const getDefaultRole = asyncHandler(async (req, res) => {
  const role = await service.getDefaultRole(req);
  return sendSuccess(res, {
    message: "Default role fetched successfully.",
    result: { role },
  });
});
