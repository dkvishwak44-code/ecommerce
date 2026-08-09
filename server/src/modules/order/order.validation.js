/**
 * Order Validation Schemas (Zod)
 */

import { z } from "zod";
import { REGEX } from "../../constants/regex.js";

const addressField = z.object({
  label: z.string().trim().optional().default("Home"),
  line1: z.string().trim().min(3, "Address line 1 is required."),
  line2: z.string().trim().optional().nullable(),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
  postalCode: z.string().trim().regex(REGEX.POSTAL_CODE, "Enter a valid postal code."),
  country: z.string().trim().default("India"),
  phone: z.string().trim().optional().nullable(),
});

export const initiateCheckoutSchema = z.object({
  shippingAddressId: z
    .string()
    .regex(REGEX.MONGO_ID, "Invalid shipping address ID.")
    .optional(),
  shippingAddress: addressField.optional(),
  billingAddress: addressField.optional().nullable(),
  paymentMethod: z
    .enum(["cod", "razorpay", "stripe", "upi", "bank_transfer"], {
      errorMap: () => ({ message: "Invalid payment method." }),
    })
    .default("cod"),
  customerNote: z
    .string()
    .trim()
    .max(500, "Note cannot exceed 500 characters.")
    .optional(),
}).refine(
  (data) => data.shippingAddressId || data.shippingAddress,
  { message: "Either shippingAddressId or shippingAddress is required." }
);

export const verifyPaymentSchema = z.object({
  orderId: z
    .string({ required_error: "Order ID is required." })
    .regex(REGEX.MONGO_ID, "Invalid order ID."),
  gatewayPaymentId: z
    .string({ required_error: "Payment ID is required." }),
  gatewaySignature: z
    .string({ required_error: "Payment signature is required." }),
});

export const cancelOrderSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Cancellation reason must be at least 5 characters.")
    .max(500, "Cancellation reason cannot exceed 500 characters.")
    .optional(),
});

export const returnRequestSchema = z.object({
  reason: z
    .string({ required_error: "Return reason is required." })
    .trim()
    .min(5, "Return reason must be at least 5 characters.")
    .max(500, "Return reason cannot exceed 500 characters."),
});
