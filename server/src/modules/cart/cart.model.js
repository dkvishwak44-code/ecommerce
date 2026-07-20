import mongoose from "mongoose";

const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    product: {
      type:     Schema.Types.ObjectId,
      ref:      "Product",
      required: true,
    },
    variantId: {
      type:    Schema.Types.ObjectId,
      default: null,
    },
    quantity: {
      type:     Number,
      required: true,
      min:      1,
      default:  1,
    },
    price: {
      type:     Number,
      required: true,
      min:      0,
    },
    subtotal: {
      type:    Number,
      min:     0,
      default: 0,
    },
    productSnapshot: {
      name:      { type: String, required: true, trim: true },
      sku:       { type: String, default: null, trim: true },
      image:     { type: String, default: null },
      variant:   { type: String, default: null, trim: true },
      storeId:   { type: Schema.Types.ObjectId, ref: "Store", default: null },
    },
  },
  { timestamps: true }
);

const cartSchema = new Schema(
  {
    customer: {
      type:     Schema.Types.ObjectId,
      ref:      "Customer",
      required: true,
      unique:   true,
      index:    true,
    },
    items: {
      type:    [cartItemSchema],
      default: [],
    },
    coupon: {
      code:     { type: String, trim: true, uppercase: true, default: null },
      discount: { type: Number, min: 0, default: 0 },
    },
    totals: {
      itemsCount: { type: Number, min: 0, default: 0 },
      subtotal:   { type: Number, min: 0, default: 0 },
      discount:   { type: Number, min: 0, default: 0 },
      total:      { type: Number, min: 0, default: 0 },
    },
  },
  { timestamps: true }
);

cartSchema.index({ updatedAt: -1 });

cartSchema.pre("save", function (next) {
  let itemsCount = 0;
  let subtotal = 0;

  this.items.forEach((item) => {
    item.subtotal = Number((item.price * item.quantity).toFixed(2));
    itemsCount += item.quantity;
    subtotal += item.subtotal;
  });

  const discount = Math.min(this.coupon?.discount || 0, subtotal);

  this.totals = {
    itemsCount,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(Math.max(subtotal - discount, 0).toFixed(2)),
  };

  if (!this.coupon?.code) {
    this.coupon = { code: null, discount: 0 };
  }

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
