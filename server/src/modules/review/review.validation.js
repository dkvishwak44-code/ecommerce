/**
 * Review Validation Schemas (Zod)
 */

import { z } from "zod";
import { REGEX } from "../../constants/regex.js";

export const createReviewSchema = z.object({
  productId: z
    .string({ required_error: "Product ID is required." })
    .regex(REGEX.MONGO_ID, "Invalid product ID."),
  rating: z
    .number({ required_error: "Rating is required." })
    .int("Rating must be a whole number.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot exceed 5."),
  title: z
    .string()
    .trim()
    .max(120, "Title cannot exceed 120 characters.")
    .optional(),
  comment: z
    .string()
    .trim()
    .max(2000, "Comment cannot exceed 2000 characters.")
    .optional(),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot exceed 5.")
    .optional(),
  title: z
    .string()
    .trim()
    .max(120, "Title cannot exceed 120 characters.")
    .optional(),
  comment: z
    .string()
    .trim()
    .max(2000, "Comment cannot exceed 2000 characters.")
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Provide at least one field to update." }
);
