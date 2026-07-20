import { z } from "zod";

const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId.");

export const addToCartSchema = z.object({
  productId: objectId,
  variantId: objectId.nullish().transform((value) => value || null),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(999, "Quantity cannot exceed 999.")
    .default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(999, "Quantity cannot exceed 999."),
});

export const applyCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Coupon code must be at least 3 characters.")
    .max(20, "Coupon code cannot exceed 20 characters.")
    .regex(/^[A-Z0-9_-]+$/i, "Coupon code can contain only letters, numbers, underscores, and hyphens.")
    .transform((value) => value.toUpperCase()),
});
