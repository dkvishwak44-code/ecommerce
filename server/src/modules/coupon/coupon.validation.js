/**
 * Coupon Validation Schemas (Zod)
 */

import { z } from "zod";

export const validateCouponSchema = z.object({
  code: z
    .string({ required_error: "Coupon code is required." })
    .trim()
    .min(3, "Coupon code must be at least 3 characters.")
    .max(20, "Coupon code cannot exceed 20 characters.")
    .toUpperCase(),
  cartTotal: z
    .number()
    .min(0, "Cart total cannot be negative.")
    .optional(),
});
