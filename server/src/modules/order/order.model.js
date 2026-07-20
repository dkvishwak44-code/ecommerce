import mongoose from "mongoose";
import { ALL_ORDER_STATUSES, ORDER_STATUS } from "../../constants/orderStatus.js";

const { Schema } = mongoose;

const addressSnapshotSchema = new Schema(
  {
    label:      { type: String, default: null },
    line1:      { type: String, required: true },
    line2:      { type: String, default: null },
    city:       { type: String, required: true },
    state:      { type: String, required: true },
    postalCode: { type: String, required: true },
    country:    { type: String, default: "India" },
    phone:      { type: String, default: null },
  },
  { _id: false }
);

const orderItemSchema = new Schema(
  {
    product:   { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: Schema.Types.ObjectId, default: null },
    name:      { type: String, required: true },
    sku:       { type: String, default: null },
    image:     { type: String, default: null },
    variant:   { type: String, default: null },
    storeId:   { type: Schema.Types.ObjectId, ref: "Store", default: null },
    quantity:  { type: Number, required: true, min: 1 },
    price:     { type: Number, required: true, min: 0 },
    subtotal:  { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer:    { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    items:       { type: [orderItemSchema], required: true },
    shippingAddress: { type: addressSnapshotSchema, required: true },
    billingAddress:  { type: addressSnapshotSchema, default: null },
    coupon: {
      code:     { type: String, default: null },
      discount: { type: Number, default: 0, min: 0 },
    },
    totals: {
      itemsCount: { type: Number, required: true, min: 0 },
      subtotal:   { type: Number, required: true, min: 0 },
      discount:   { type: Number, default: 0, min: 0 },
      shipping:   { type: Number, default: 0, min: 0 },
      tax:        { type: Number, default: 0, min: 0 },
      total:      { type: Number, required: true, min: 0 },
      currency:   { type: String, default: "INR" },
    },
    status: {
      type:    String,
      enum:    ALL_ORDER_STATUSES,
      default: ORDER_STATUS.PENDING,
      index:   true,
    },
    payment: {
      provider:          { type: String, enum: ["razorpay", "cod"], default: "razorpay" },
      status:            { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
      razorpayOrderId:   { type: String, default: null, index: true },
      razorpayPaymentId: { type: String, default: null, index: true },
      razorpaySignature: { type: String, default: null, select: false },
      paidAt:            { type: Date, default: null },
      failureReason:     { type: String, default: null },
    },
    notes: {
      customer:     { type: String, default: null, trim: true },
      cancellation: { type: String, default: null, trim: true },
      returnReason: { type: String, default: null, trim: true },
    },
    statusHistory: [
      {
        status:    { type: String, enum: ALL_ORDER_STATUSES, required: true },
        note:      { type: String, default: null },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1, createdAt: -1 });

orderSchema.pre("save", function (next) {
  if (this.isNew && !this.statusHistory?.length) {
    this.statusHistory = [{ status: this.status, note: "Order created." }];
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
