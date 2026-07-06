import joi from "joi";

/**
 * Create Role Validation Schema
 */
export const createRoleSchema = joi.object().keys({
  name: joi
    .string()
    .required()
    .lowercase()
    .trim()
    .min(2)
    .max(60)
    .messages({
      "string.required": "Role name is required.",
      "string.empty": "Role name cannot be empty.",
      "string.min": "Role name must be at least 2 characters.",
      "string.max": "Role name cannot exceed 60 characters.",
    }),

  displayName: joi
    .string()
    .required()
    .trim()
    .min(2)
    .max(80)
    .messages({
      "string.required": "Role display name is required.",
      "string.empty": "Role display name cannot be empty.",
      "string.min": "Role display name must be at least 2 characters.",
      "string.max": "Role display name cannot exceed 80 characters.",
    }),

  description: joi
    .string()
    .optional()
    .trim()
    .max(300)
    .messages({
      "string.max": "Role description cannot exceed 300 characters.",
    }),

  permissions: joi
    .array()
    .items(joi.string().required())
    .optional()
    .messages({
      "array.base": "Permissions must be an array.",
    }),
});

/**
 * Update Role Validation Schema
 */
export const updateRoleSchema = joi.object().keys({
  displayName: joi
    .string()
    .optional()
    .trim()
    .min(2)
    .max(80)
    .messages({
      "string.min": "Role display name must be at least 2 characters.",
      "string.max": "Role display name cannot exceed 80 characters.",
    }),

  description: joi
    .string()
    .optional()
    .trim()
    .max(300)
    .messages({
      "string.max": "Role description cannot exceed 300 characters.",
    }),

  permissions: joi
    .array()
    .items(joi.string().required())
    .optional()
    .messages({
      "array.base": "Permissions must be an array.",
    }),

  isActive: joi
    .boolean()
    .optional()
    .messages({
      "boolean.base": "isActive must be a boolean.",
    }),
}).min(1);

/**
 * Assign Permissions Validation Schema
 */
export const assignPermissionsSchema = joi.object().keys({
  permissions: joi
    .array()
    .items(joi.string().required())
    .required()
    .messages({
      "array.required": "Permissions are required.",
      "array.base": "Permissions must be an array.",
    }),

  action: joi
    .string()
    .valid("set", "add", "remove")
    .optional()
    .default("set")
    .messages({
      "any.only": "Action must be 'set', 'add', or 'remove'.",
    }),
});

/**
 * Bulk Update Status Validation Schema
 */
export const bulkUpdateStatusSchema = joi.object().keys({
  ids: joi
    .array()
    .items(joi.string().required())
    .required()
    .min(1)
    .messages({
      "array.min": "At least one role ID is required.",
      "array.required": "Role IDs are required.",
    }),

  isActive: joi
    .boolean()
    .required()
    .messages({
      "boolean.required": "isActive status is required.",
      "boolean.base": "isActive must be a boolean.",
    }),
});
