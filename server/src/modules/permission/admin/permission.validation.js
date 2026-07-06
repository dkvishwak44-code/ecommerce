import joi from "joi";

/**
 * Create Permission Validation Schema
 */
export const createPermissionSchema = joi.object().keys({
  key: joi
    .string()
    .required()
    .lowercase()
    .trim()
    .messages({
      "string.required": "Permission key is required.",
      "string.empty": "Permission key cannot be empty.",
    }),

  module: joi
    .string()
    .required()
    .lowercase()
    .trim()
    .messages({
      "string.required": "Permission module is required.",
      "string.empty": "Permission module cannot be empty.",
    }),

  action: joi
    .string()
    .required()
    .lowercase()
    .trim()
    .messages({
      "string.required": "Permission action is required.",
      "string.empty": "Permission action cannot be empty.",
    }),

  description: joi
    .string()
    .optional()
    .trim()
    .max(250)
    .messages({
      "string.max": "Permission description cannot exceed 250 characters.",
    }),
});

/**
 * Update Permission Validation Schema
 */
export const updatePermissionSchema = joi.object().keys({
  module: joi
    .string()
    .optional()
    .lowercase()
    .trim()
    .messages({
      "string.empty": "Permission module cannot be empty.",
    }),

  action: joi
    .string()
    .optional()
    .lowercase()
    .trim()
    .messages({
      "string.empty": "Permission action cannot be empty.",
    }),

  description: joi
    .string()
    .optional()
    .trim()
    .max(250)
    .messages({
      "string.max": "Permission description cannot exceed 250 characters.",
    }),

  isActive: joi
    .boolean()
    .optional()
    .messages({
      "boolean.base": "isActive must be a boolean.",
    }),
}).min(1);

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
      "array.min": "At least one permission ID is required.",
      "array.required": "Permission IDs are required.",
    }),

  isActive: joi
    .boolean()
    .required()
    .messages({
      "boolean.required": "isActive status is required.",
      "boolean.base": "isActive must be a boolean.",
    }),
});
