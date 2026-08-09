/**
 * Coupon Model
 * Discount codes with usage limits, scheduling, and applicability rules.
 */

import mongoose from "mongoose";
import { COUPON_STATUS } from "../../constants/status.js";

const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required."],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters."],
      default: null,
    },

    // ── Discount ──────────────────────────────────────────────────────────────
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Coupon type is required."],
    },

    value: {
      type: Number,
      required: [true, "Discount value is required."],
      min: [0, "Discount value cannot be negative."],
    },

    maxDiscount: {
      type: Number,
      default: null, // cap for percentage coupons
      min: 0,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ── Usage ─────────────────────────────────────────────────────────────────
    usageLimit: { type: Number, default: null, min: 1 }, // null = unlimited
    usedCount: { type: Number, default: 0, min: 0 },
    perUserLimit: { type: Number, default: 1, min: 1 },

    usedBy: [
      {
        customer: { type: Schema.Types.ObjectId, ref: "Customer" },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: Schema.Types.ObjectId, ref: "Order", default: null },
      },
    ],

    // ── Scheduling ────────────────────────────────────────────────────────────
    validFrom: { type: Date, default: null },
    validUntil: { type: Date, default: null },

    // ── Applicability ─────────────────────────────────────────────────────────
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableStores: [{ type: Schema.Types.ObjectId, ref: "Store" }],

    // ── Status ────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(COUPON_STATUS),
      default: COUPON_STATUS.ACTIVE,
      index: true,
    },

    isActive: { type: Boolean, default: true, index: true },

    // ── Association ───────────────────────────────────────────────────────────
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });

// ── Virtuals ──────────────────────────────────────────────────────────────────
couponSchema.virtual("isExpired").get(function () {
  if (!this.validUntil) return false;
  return new Date() > this.validUntil;
});

couponSchema.virtual("isExhausted").get(function () {
  if (!this.usageLimit) return false;
  return this.usedCount >= this.usageLimit;
});

couponSchema.virtual("isValid").get(function () {
  return this.isActive && !this.isExpired && !this.isExhausted;
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
