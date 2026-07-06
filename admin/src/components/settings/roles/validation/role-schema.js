import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(2, "At least 2 characters required.")
    .max(50, "Maximum 50 characters.")
    .regex(/^[a-zA-Z0-9_\s-]+$/, "Only letters, numbers, spaces, hyphens allowed."),

  displayName: z
    .string()
    .max(100, "Maximum 100 characters.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .max(300, "Maximum 300 characters.")
    .optional()
    .or(z.literal("")),

  permissions: z
    .record(z.array(z.string()))
    .refine(
      (val) => Object.values(val).flat().length > 0,
      { message: "At least one permission must be selected." }
    ),
});