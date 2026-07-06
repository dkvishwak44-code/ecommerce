import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(200, "Name cannot exceed 200 characters."),

  subCategory: z
    .string()
    .min(1, "Please select a category type."),

  price: z
    .coerce.number({ invalid_type_error: "Price must be a number." })
    .positive("Price must be greater than 0."),

  salePrice: z
    .coerce.number()
    .min(0, "Sale price cannot be negative.")
    .optional()
    .or(z.literal("")),

  costPrice: z
    .coerce.number()
    .min(0, "Cost price cannot be negative.")
    .optional()
    .or(z.literal("")),

  stock: z
    .coerce.number({ invalid_type_error: "Stock must be a number." })
    .min(0, "Stock cannot be negative."),

  lowStockThreshold: z
    .coerce.number()
    .min(0, "Threshold cannot be negative.")
    .default(5),

  shortDescription: z
    .string()
    .max(300, "Short description cannot exceed 300 characters.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters.")
    .optional()
    .or(z.literal("")),

  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters.")
    .max(100, "SKU cannot exceed 100 characters."),

  status: z.enum(["active", "draft", "inactive"], {
    required_error: "Status is required.",
  }),

  isPublished: z.boolean().default(true),
  isFeatured:  z.boolean().default(false),
}).superRefine((data, ctx) => {
  // Sale price must be less than original price
  if (data.salePrice && data.salePrice >= data.price) {
    ctx.addIssue({
      path:    ["salePrice"],
      code:    z.ZodIssueCode.custom,
      message: "Sale price must be less than original price.",
    });
  }
});

export const imageValidation = (images) => {
  if (images.length === 0) return "At least 1 image is required.";
  return null;
};