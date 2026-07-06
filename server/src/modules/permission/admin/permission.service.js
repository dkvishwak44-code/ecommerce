import Permission from "../permission.model.js";
import { AppError } from "../../../utils/AppError.js";
import { auditLog } from "../../../utils/auditLogger.js";

/**
 * Create a new permission
 */
export const createPermission = async (req) => {
  const { key, module, action, description } = req.body;

  // Check if permission already exists
  const exists = await Permission.findOne({ key: key.toLowerCase() });
  if (exists) {
    throw new AppError("Permission with this key already exists.", 409);
  }

  const permission = await Permission.create({
    key: key.toLowerCase(),
    module: module.toLowerCase(),
    action: action.toLowerCase(),
    description,
    isSystem: false,
    isActive: true,
  });

  auditLog({
    action: "CREATE",
    entity: "PERMISSION",
    entityId: permission._id,
    req,
    changes: { after: permission },
  });

  return permission;
};

/**
 * Get all permissions with optional filtering
 */
export const getAllPermissions = async (req) => {
  const { page = 1, limit = 20, module, isActive, search } = req.query;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(200, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  // Filter by module
  if (module) {
    filter.module = String(module).toLowerCase();
  }

  // Filter by active status
  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  // Search by key, module, or description
  if (search) {
    filter.$or = [
      { key: { $regex: search, $options: "i" } },
      { module: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [permissions, total] = await Promise.all([
    Permission.find(filter)
      .sort({ module: 1, action: 1 })
      .skip(skip)
      .limit(limitNum)
      .select("+_id module key action")
      .lean(),
    Permission.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / limitNum);

  return {
    permissions,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages,
    },
  };
};

/**
 * Get permission by ID
 */
export const getPermissionById = async (req) => {
  const { id } = req.params;

  const permission = await Permission.findById(id);
  if (!permission) {
    throw new AppError("Permission not found.", 404);
  }

  return permission;
};

/**
 * Update permission
 */
export const updatePermission = async (req) => {
  const { id } = req.params;
  const { module, action, description, isActive } = req.body;

  const permission = await Permission.findById(id);
  if (!permission) {
    throw new AppError("Permission not found.", 404);
  }

  // System permissions cannot be modified (except isActive status)
  if (permission.isSystem && (module || action)) {
    throw new AppError(
      "System permissions cannot be modified. Only isActive status can be changed.",
      403,
    );
  }

  const previousData = permission.toObject();

  // Update allowed fields
  if (module) permission.module = String(module).toLowerCase();
  if (action) permission.action = String(action).toLowerCase();
  if (description !== undefined) permission.description = description;
  if (isActive !== undefined) permission.isActive = isActive;

  const updated = await permission.save();

  auditLog({
    action: "UPDATE",
    entity: "PERMISSION",
    entityId: updated._id,
    req,
    changes: {
      before: previousData,
      after: updated.toObject(),
    },
  });

  return updated;
};

/**
 * Delete permission
 */
export const deletePermission = async (req) => {
  const { id } = req.params;

  const permission = await Permission.findById(id);
  if (!permission) {
    throw new AppError("Permission not found.", 404);
  }

  // System permissions cannot be deleted
  if (permission.isSystem) {
    throw new AppError("System permissions cannot be deleted.", 403);
  }

  const permissionData = permission.toObject();
  await Permission.findByIdAndDelete(id);

  auditLog({
    action: "DELETE",
    entity: "PERMISSION",
    entityId: id,
    req,
    changes: { before: permissionData },
  });

  return { message: "Permission deleted successfully." };
};

/**
 * Bulk activate/deactivate permissions
 */
export const bulkUpdateStatus = async (req) => {
  const { ids, isActive } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError("At least one permission ID is required.", 400);
  }

  const permissions = await Permission.find({ _id: { $in: ids } });

  // Check if any are system permissions
  const systemPermissions = permissions.filter((p) => p.isSystem);
  if (systemPermissions.length > 0) {
    throw new AppError(
      `Cannot change status of system permissions: ${systemPermissions.map((p) => p.key).join(", ")}`,
      403,
    );
  }

  const result = await Permission.updateMany(
    { _id: { $in: ids } },
    { isActive },
  );

  auditLog({
    action: "BULK_UPDATE",
    entity: "PERMISSION",
    req,
    changes: {
      ids,
      updatedStatus: isActive,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    },
  });

  return {
    message: "Permissions updated successfully.",
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

/**
 * Get permissions by module
 */
export const getPermissionsByModule = async (req) => {
  const { module } = req.params;
  const { isActive = true } = req.query;

  const filter = {
    module: String(module).toLowerCase(),
  };

  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  const permissions = await Permission.find(filter).sort({ action: 1 }).lean();

  if (permissions.length === 0) {
    throw new AppError(`No permissions found for module: ${module}`, 404);
  }

  return {
    module: String(module).toLowerCase(),
    permissions,
  };
};

/**
 * Get all unique modules
 */
export const getModules = async (req) => {
  const { isActive } = req.query;

  const filter = {};
  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  const modules = await Permission.distinct("module", filter);

  return {
    modules: modules.sort(),
    count: modules.length,
  };
};
