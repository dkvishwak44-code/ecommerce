import { z } from "zod";

export const addUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),

  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number.")
    .optional()
    .or(z.literal("")),

  role: z.string().min(1, "Please select a role."),

  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status.",
  }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Must contain at least one number."),
});
