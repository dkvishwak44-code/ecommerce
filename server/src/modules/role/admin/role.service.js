import Role from "../role.model.js";
import Permission from "../../permission/permission.model.js";
import { AppError } from "../../../utils/AppError.js";
import { auditLog } from "../../../utils/auditLogger.js";
import { SYSTEM_ROLES } from "../../../constants/roles.js";
import Store from "../../store/store.model.js";

/**
 * Create a new role
 */
export const createRole = async (req) => {
  const {
    name,
    displayName,
    description,
    permissions = [],
    storeId,
  } = req.body;

  // storeId required — custom store-level roles ke liye zaroori hai
  if (!storeId) {
    throw new AppError("storeId is required.", 400);
  }

  const store = await Store.findOne({
    _id: storeId,
    isActive: true,
  });
  if (!store) {
    throw new AppError("Invalid or inactive storeId.", 404);
  }

  // Check if role name already exists
  const exists = await Role.findOne({ name: name.toLowerCase(), storeId });
  if (exists) {
    throw new AppError("Role with this name already exists.", 409);
  }

  // Validate permissions exist if provided
  if (permissions.length > 0) {
    const validPermissions = await Permission.find({
      _id: { $in: permissions },
    });
    if (validPermissions.length !== permissions.length) {
      throw new AppError("One or more permission IDs are invalid.", 400);
    }
  }

  const role = await Role.create({
    name: name.toLowerCase(),
    displayName,
    description,
    permissions,
    storeId,
    isActive: true,
  });

  // Populate permissions before returning
  await role.populate("permissions");

  auditLog({
    action: "CREATE",
    entity: "ROLE",
    entityId: role._id,
    req,
    changes: { after: role },
  });

  return role;
};

/**
 * Get all roles with optional filtering
 */
/**
 * Get all roles with optional filtering
 */
export const getAllRoles = async (req) => {
  const {
    page = 1,
    limit = 20,
    isSystem,
    isActive,
    search,
    storeId,
  } = req.query;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const filter = {
    // superadmin/admin kabhi bhi list mein nahi aayenge — assignable roles hi dikhenge
    name: { $nin: [...SYSTEM_ROLES] },
  };

  // Filter by system role status
  if (isSystem !== undefined) {
    filter.isSystem = isSystem === "true" || isSystem === true;
  }

  // Filter by active status
  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  if (storeId) {
    filter.storeId = storeId;
  }

  // Search by name or display name
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { displayName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  console.log("filter :", filter);

  const [roles, total] = await Promise.all([
    Role.find(filter)
      .sort({ isSystem: -1, name: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Role.countDocuments(filter),
  ]);

  console.log("roles :", roles);

  const pages = Math.ceil(total / limitNum);

  return {
    roles,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages,
    },
  };
};

/**
 * Get role by ID
 */
export const getRoleById = async (req) => {
  const { id } = req.params;

  const role = await Role.findById(id).populate("permissions");
  if (!role) {
    throw new AppError("Role not found.", 404);
  }

  return role;
};

/**
 * Update role
 */
export const updateRole = async (req) => {
  const { id } = req.params;
  const { displayName, description, permissions, isActive } = req.body;

  const role = await Role.findById(id);
  if (!role) {
    throw new AppError("Role not found.", 404);
  }

  // System roles cannot be modified (except permissions and isActive)
  if (role.isSystem && req.body.name) {
    throw new AppError(
      "System roles cannot be renamed. Only permissions and isActive can be changed.",
      403,
    );
  }

  const previousData = role.toObject();

  // Update allowed fields
  if (displayName) role.displayName = displayName;
  if (description !== undefined) role.description = description;
  if (permissions !== undefined) {
    // Validate permissions exist
    if (permissions.length > 0) {
      const validPermissions = await Permission.find({
        _id: { $in: permissions },
      });
      if (validPermissions.length !== permissions.length) {
        throw new AppError("One or more permission IDs are invalid.", 400);
      }
    }
    role.permissions = permissions;
  }
  if (isActive !== undefined) role.isActive = isActive;

  const updated = await role.save();
  await updated.populate("permissions");

  auditLog({
    action: "UPDATE",
    entity: "ROLE",
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
 * Delete role
 */
export const deleteRole = async (req) => {
  const { id } = req.params;

  const role = await Role.findById(id);
  if (!role) {
    throw new AppError("Role not found.", 404);
  }

  // System roles cannot be deleted
  if (role.isSystem) {
    throw new AppError("System roles cannot be deleted.", 403);
  }

  // Check if role is default
  if (role.isDefault) {
    throw new AppError(
      "Default role cannot be deleted. Assign another role as default first.",
      403,
    );
  }

  const roleData = role.toObject();
  await Role.findByIdAndDelete(id);

  auditLog({
    action: "DELETE",
    entity: "ROLE",
    entityId: id,
    req,
    changes: { before: roleData },
  });

  return { message: "Role deleted successfully." };
};

/**
 * Assign permissions to a role
 */
export const assignPermissions = async (req) => {
  const { id } = req.params;
  const { permissions, action = "set" } = req.body;

  const role = await Role.findById(id);
  if (!role) {
    throw new AppError("Role not found.", 404);
  }

  // Validate permissions exist
  if (permissions.length > 0) {
    const validPermissions = await Permission.find({
      _id: { $in: permissions },
    });
    if (validPermissions.length !== permissions.length) {
      throw new AppError("One or more permission IDs are invalid.", 400);
    }
  }

  const previousData = role.toObject();

  if (action === "set") {
    // Replace all permissions
    role.permissions = permissions;
  } else if (action === "add") {
    // Add permissions to existing
    const existingIds = role.permissions.map((p) => p.toString());
    const newPermissions = permissions.filter(
      (p) => !existingIds.includes(p.toString()),
    );
    role.permissions = [...role.permissions, ...newPermissions];
  } else if (action === "remove") {
    // Remove permissions
    role.permissions = role.permissions.filter(
      (p) => !permissions.includes(p.toString()),
    );
  }

  const updated = await role.save();
  await updated.populate("permissions");

  auditLog({
    action: "ASSIGN_PERMISSIONS",
    entity: "ROLE",
    entityId: updated._id,
    req,
    changes: {
      before: previousData,
      after: updated.toObject(),
      permissionAction: action,
    },
  });

  return updated;
};

/**
 * Bulk update role status
 */
export const bulkUpdateStatus = async (req) => {
  const { ids, isActive } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError("At least one role ID is required.", 400);
  }

  const roles = await Role.find({ _id: { $in: ids } });

  // Check if any are system roles
  const systemRoles = roles.filter((r) => r.isSystem);
  if (systemRoles.length > 0) {
    throw new AppError(
      `Cannot change status of system roles: ${systemRoles.map((r) => r.name).join(", ")}`,
      403,
    );
  }

  const result = await Role.updateMany({ _id: { $in: ids } }, { isActive });

  auditLog({
    action: "BULK_UPDATE",
    entity: "ROLE",
    req,
    changes: {
      ids,
      updatedStatus: isActive,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    },
  });

  return {
    message: "Roles updated successfully.",
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

/**
 * Get system roles
 */
export const getSystemRoles = async (req) => {
  const roles = await Role.find({ isSystem: true })
    .populate("permissions")
    .sort({ name: 1 })
    .lean();

  return {
    roles,
    count: roles.length,
  };
};

/**
 * Set role as default
 */
export const setDefaultRole = async (req) => {
  const { id } = req.params;

  const role = await Role.findById(id);
  if (!role) {
    throw new AppError("Role not found.", 404);
  }

  // Remove default from all other roles
  await Role.updateMany({ _id: { $ne: id } }, { isDefault: false });

  // Set this role as default
  role.isDefault = true;
  const updated = await role.save();
  await updated.populate("permissions");

  auditLog({
    action: "SET_DEFAULT",
    entity: "ROLE",
    entityId: updated._id,
    req,
    changes: { after: updated },
  });

  return updated;
};

/**
 * Get default role
 */
export const getDefaultRole = async (req) => {
  const role = await Role.findOne({ isDefault: true }).populate("permissions");
  if (!role) {
    throw new AppError("No default role set.", 404);
  }

  return role;
};
