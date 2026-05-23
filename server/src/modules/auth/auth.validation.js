import { z } from "zod";

// ─── Shared ───────────────────────────────────────────────────────────────────

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+])[A-Za-z\d@$!%*?&#^()\-_=+]{8,32}$/;

const emailField = z
  .string({ required_error: "Email is required" })
  .email("Please provide a valid email address")
  .toLowerCase()
  .trim();

const passwordField = (label = "Password") =>
  z
    .string({ required_error: `${label} is required` })
    .regex(
      passwordRegex,
      `${label} must be 8-32 characters and include uppercase, lowercase, number, and special character`
    );

// ─── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .trim(),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .trim(),
    email: emailField,
    password: passwordField("Password"),
    confirmPassword: z.string({ required_error: "Confirm password is required" }),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .regex(/^\+?[\d\s\-()]+$/, "Please provide a valid phone number")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: emailField,
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string({ required_error: "Current password is required" }).min(1, "Current password is required"),
    newPassword: passwordField("New password"),
    confirmPassword: z.string({ required_error: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  email: emailField,
});

const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: "Reset token is required" }).min(1, "Reset token is required"),
    newPassword: passwordField("Password"),
    confirmPassword: z.string({ required_error: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const verifyOtpSchema = z.object({
  email: emailField,
  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

const resendOtpSchema = z.object({
  email: emailField,
});

const refreshTokenSchema = z.object({
  refreshToken: z.string({ required_error: "Refresh token is required" }).min(1, "Refresh token is required"),
});

export {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  resendOtpSchema,
  refreshTokenSchema,
};