/**
 * Cart Validation Schemas (Zod)
 */

import { z } from "zod";
import { REGEX } from "../../constants/regex.js";

export const addToCartSchema = z.object({
  productId: z
    .string({ required_error: "Product ID is required." })
    .regex(REGEX.MONGO_ID, "Invalid product ID."),
  quantity: z
    .number({ required_error: "Quantity is required." })
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(50, "Quantity cannot exceed 50.")
    .default(1),
  variant: z
    .object({
      name: z.string().trim().optional(),
      value: z.string().trim().optional(),
    })
    .optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number({ required_error: "Quantity is required." })
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(50, "Quantity cannot exceed 50."),
});

export const applyCouponSchema = z.object({
  code: z
    .string({ required_error: "Coupon code is required." })
    .trim()
    .min(3, "Coupon code must be at least 3 characters.")
    .max(20, "Coupon code cannot exceed 20 characters.")
    .toUpperCase(),
});
