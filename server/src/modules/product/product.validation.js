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

  storeId: z
    .string()
    .min(1, "Store ID is required"),

  sellerId: z.string().optional(),

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

  storeId: z.string().optional(),

  sellerId: z.string().optional(),

  categoryId: z.string().optional(),

  tags: z.array(z.string()).optional(),
});
