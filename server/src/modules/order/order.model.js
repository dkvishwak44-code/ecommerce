/**
 * Order Model
 * Represents a customer order with items, addresses, payment, and status tracking.
 */

import mongoose from "mongoose";
import { PAYMENT_STATUS } from "../../constants/status.js";

const { Schema } = mongoose;

// ── Order Status Constants ────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURN_REQUESTED: "return_requested",
  RETURN_APPROVED: "return_approved",
  RETURNED: "returned",
  REFUNDED: "refunded",
};

export const ALL_ORDER_STATUSES = Object.values(ORDER_STATUS);

// ── Order Item Sub-schema ─────────────────────────────────────────────────────
const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    slug: { type: String, default: null },
    sku: { type: String, default: null },
    thumbnail: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    variant: {
      name: { type: String, default: null },
      value: { type: String, default: null },
    },
    total: { type: Number, required: true, min: 0 }, // (salePrice || price) * quantity
    store: { type: Schema.Types.ObjectId, ref: "Store", default: null },
  },
  { _id: true }
);

// ── Address Snapshot Sub-schema ───────────────────────────────────────────────
const addressSnapshotSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    line1: { type: String, required: true },
    line2: { type: String, default: null },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },
    phone: { type: String, default: null },
  },
  { _id: false }
);

// ── Status History Sub-schema ─────────────────────────────────────────────────
const statusHistorySchema = new Schema(
  {
    status: { type: String, enum: ALL_ORDER_STATUSES, required: true },
    note: { type: String, trim: true, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ── Order Schema ──────────────────────────────────────────────────────────────
const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    items: { type: [orderItemSchema], required: true },

    // ── Addresses (snapshot at order time) ────────────────────────────────────
    shippingAddress: { type: addressSnapshotSchema, required: true },
    billingAddress: { type: addressSnapshotSchema, default: null },

    // ── Payment ───────────────────────────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay", "stripe", "upi", "bank_transfer"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },

    paymentDetails: {
      gatewayOrderId: { type: String, default: null },
      gatewayPaymentId: { type: String, default: null },
      gatewaySignature: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },

    // ── Order Status ──────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ALL_ORDER_STATUSES,
      default: ORDER_STATUS.PENDING,
      index: true,
    },

    statusHistory: { type: [statusHistorySchema], default: [] },

    // ── Financials ────────────────────────────────────────────────────────────
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    coupon: {
      code: { type: String, default: null },
      couponId: { type: Schema.Types.ObjectId, ref: "Coupon", default: null },
      discountAmount: { type: Number, default: 0, min: 0 },
    },

    // ── Shipping ──────────────────────────────────────────────────────────────
    trackingNumber: { type: String, trim: true, default: null },
    shippingProvider: { type: String, trim: true, default: null },
    estimatedDelivery: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },

    // ── Return / Cancel ───────────────────────────────────────────────────────
    cancelReason: { type: String, trim: true, default: null },
    cancelledAt: { type: Date, default: null },

    returnReason: { type: String, trim: true, default: null },
    returnRequestedAt: { type: Date, default: null },

    // ── Notes ─────────────────────────────────────────────────────────────────
    customerNote: { type: String, trim: true, maxlength: 500, default: null },
    adminNote: { type: String, trim: true, maxlength: 500, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "items.store": 1, status: 1 });

// ── Pre-save: Generate Order Number ───────────────────────────────────────────
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }

  // Push status to history on status change
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
    });
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
