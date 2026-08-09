/**
 * Cart Model
 * One cart per customer. Contains line items, optional coupon, and calculated totals.
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

// ── Cart Item Sub-schema ──────────────────────────────────────────────────────
const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: { type: String, required: true },
    slug: { type: String, default: null },

    // Snapshot of price at time of add (for display; recalculated on checkout)
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null, min: 0 },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1."],
      max: [50, "Quantity cannot exceed 50."],
      default: 1,
    },

    // Optional variant selection
    variant: {
      name: { type: String, default: null },
      value: { type: String, default: null },
    },

    thumbnail: { type: String, default: null },
  },
  { _id: true, timestamps: true }
);

// ── Cart Schema ───────────────────────────────────────────────────────────────
const cartSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
      index: true,
    },

    items: { type: [cartItemSchema], default: [] },

    // ── Coupon ─────────────────────────────────────────────────────────────────
    coupon: {
      code: { type: String, default: null },
      couponId: { type: Schema.Types.ObjectId, ref: "Coupon", default: null },
      discountType: { type: String, enum: ["percentage", "fixed", null], default: null },
      discountValue: { type: Number, default: 0, min: 0 },
      discountAmount: { type: Number, default: 0, min: 0 }, // calculated
    },

    // ── Totals ─────────────────────────────────────────────────────────────────
    subtotal: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },

    itemCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// ── Methods ───────────────────────────────────────────────────────────────────

/**
 * Recalculate subtotal, discount, tax, total from items + coupon.
 * Call this after any item/coupon change, then save().
 */
cartSchema.methods.recalculate = function () {
  // Subtotal
  this.subtotal = this.items.reduce((sum, item) => {
    const unitPrice = item.salePrice != null ? item.salePrice : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon discount
  if (this.coupon?.code) {
    if (this.coupon.discountType === "percentage") {
      this.coupon.discountAmount = Math.round(
        (this.subtotal * this.coupon.discountValue) / 100
      );
    } else if (this.coupon.discountType === "fixed") {
      this.coupon.discountAmount = Math.min(this.coupon.discountValue, this.subtotal);
    }
    this.discount = this.coupon.discountAmount;
  } else {
    this.discount = 0;
    this.coupon = { code: null, couponId: null, discountType: null, discountValue: 0, discountAmount: 0 };
  }

  // Tax (placeholder 0% — integrate calculateTax utility as needed)
  this.tax = 0;

  // Total
  this.total = Math.max(0, this.subtotal - this.discount + this.tax);

  return this;
};

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
