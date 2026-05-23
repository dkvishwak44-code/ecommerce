// modules/product/product.validation.js

import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  sku: z
    .string()
    .min(2, "SKU is required"),

  description: z.string().optional(),

  shortDescription: z.string().optional(),

  price: z.number({
    required_error: "Price is required",
  }),

  salePrice: z.number().optional(),

  stock: z.number({
    required_error: "Stock is required",
  }),

  categoryId: z.string(),

  tags: z.array(z.string()).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),

  sku: z.string().optional(),

  description: z.string().optional(),

  shortDescription: z.string().optional(),

  price: z.number().optional(),

  salePrice: z.number().optional(),

  stock: z.number().optional(),

  categoryId: z.string().optional(),

  tags: z.array(z.string()).optional(),
});