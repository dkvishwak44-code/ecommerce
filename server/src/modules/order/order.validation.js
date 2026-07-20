import { z } from "zod";

const objectId = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId.");

const addressSchema = z.object({
  label: z.string().trim().optional().nullable(),
  line1: z.string().trim().min(3),
  line2: z.string().trim().optional().nullable(),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  postalCode: z.string().trim().min(3),
  country: z.string().trim().min(2).default("India"),
  phone: z.string().trim().optional().nullable(),
});

export const initiateCheckoutSchema = z.object({
  shippingAddressId: objectId.optional(),
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
  notes: z.string().trim().max(500).optional(),
}).refine((data) => data.shippingAddressId || data.shippingAddress, {
  message: "Provide shippingAddressId or shippingAddress.",
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
});

export const cancelOrderSchema = z.object({
  reason: z.string().trim().min(3).max(300).optional(),
});

export const returnRequestSchema = z.object({
  reason: z.string().trim().min(3).max(500),
});
