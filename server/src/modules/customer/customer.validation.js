/**
 * Customer Validation Schemas
 * Uses Zod. Validated by validate.middleware.js before controller runs.
 *
 * validate.middleware.js usage:
 *   import { validate } from "../middleware/validate.middleware.js";
 *   import { updateProfileSchema, addressSchema } from "./customer.validation.js";
 *   router.patch("/profile", validate(updateProfileSchema), updateProfile);
 *
 * validate.middleware.js expects:
 *   schema.parse(req.body)  — throws ZodError on failure
 */

import { z } from "zod";
import { REGEX } from "../../constants/regex.js";

// ── Reusable field definitions ────────────────────────────────────────────────

const phoneField = z
  .string()
  .trim()
  .regex(REGEX.PHONE, "Enter a valid phone number (e.g. +919876543210).")
  .nullish()
  .transform((v) => v ?? null);

const postalCodeField = z
  .string()
  .trim()
  .regex(REGEX.POSTAL_CODE, "Enter a valid postal code.");

// ── Profile Update ────────────────────────────────────────────────────────────
// All fields optional — but at least one must be provided (.refine below).
// Email & password are intentionally excluded — they have their own flows.

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2,  "Name must be at least 2 characters.")
      .max(60, "Name cannot exceed 60 characters.")
      .regex(REGEX.NAME, "Name can only contain letters, spaces, hyphens, and apostrophes.")
      .optional(),

    phone: phoneField.optional(),

    dateOfBirth: z
      .string()
      .datetime({ message: "Enter a valid ISO date (e.g. 1995-06-15T00:00:00.000Z)." })
      .refine(
        (val) => new Date(val) < new Date(),
        "Date of birth cannot be in the future."
      )
      .nullish()
      .optional(),

    gender: z
      .enum(["male", "female", "other", "prefer_not_to_say"], {
        errorMap: () => ({
          message: "Gender must be male, female, other, or prefer_not_to_say.",
        }),
      })
      .nullish()
      .optional(),

    preferences: z
      .object({
        newsletter:   z.boolean().optional(),
        smsAlerts:    z.boolean().optional(),
        pushAlerts:   z.boolean().optional(),
        orderUpdates: z.boolean().optional(),
        promotions:   z.boolean().optional(),
        language:     z.string().trim().max(10).optional(),
        currency:     z
          .string()
          .trim()
          .length(3, "Currency must be a 3-letter ISO code (e.g. INR, USD).")
          .toUpperCase()
          .optional(),
      })
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "Provide at least one field to update." }
  );

// ── Address ───────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  label: z
    .enum(["Home", "Work", "Other"], {
      errorMap: () => ({ message: "Label must be Home, Work, or Other." }),
    })
    .default("Home"),

  line1: z
    .string()
    .trim()
    .min(3,   "Address line 1 must be at least 3 characters.")
    .max(150, "Address line 1 cannot exceed 150 characters."),

  line2: z
    .string()
    .trim()
    .max(150, "Address line 2 cannot exceed 150 characters.")
    .nullish()
    .optional()
    .transform((v) => v ?? null),

  city: z
    .string()
    .trim()
    .min(2,  "City must be at least 2 characters.")
    .max(60, "City cannot exceed 60 characters."),

  state: z
    .string()
    .trim()
    .min(2,  "State must be at least 2 characters.")
    .max(60, "State cannot exceed 60 characters."),

  postalCode: postalCodeField,

  country: z
    .string()
    .trim()
    .min(2,  "Country must be at least 2 characters.")
    .max(60, "Country cannot exceed 60 characters.")
    .default("India"),

  phone: phoneField.optional(),

  isDefault: z.boolean().default(false),
});

// ── Change Password ───────────────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .regex(
        REGEX.PASSWORD,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),

    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path:    ["confirmPassword"],
    }
  )
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must be different from your current password.",
      path:    ["newPassword"],
    }
  );

// ── Types (inferred — useful in TypeScript or JSDoc) ─────────────────────────

/**
 * @typedef {z.infer<typeof updateProfileSchema>} UpdateProfileInput
 * @typedef {z.infer<typeof addressSchema>}       AddressInput
 * @typedef {z.infer<typeof changePasswordSchema>} ChangePasswordInput
 */