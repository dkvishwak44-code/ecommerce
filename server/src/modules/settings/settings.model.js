import mongoose from "mongoose";

const { Schema } = mongoose;

// ── Payment Gateway Sub-schema ────────────────────────────────────────────────
const paymentGatewaySchema = new Schema(
  {
    isEnabled:  { type: Boolean, default: false },
    keyId:      { type: String,  trim: true, default: null, select: false },
    keySecret:  { type: String,  trim: true, default: null, select: false },
    webhookSecret: { type: String, trim: true, default: null, select: false },
    mode: {
      type: String,
      enum: ["sandbox", "live"],
      default: "sandbox",
    },
  },
  { _id: false }
);

// ── Email Provider Sub-schema ─────────────────────────────────────────────────
const emailProviderSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ["smtp", "sendgrid", "mailgun", "ses"],
      default: "smtp",
    },
    host:     { type: String, trim: true, default: null, select: false },
    port:     { type: Number, default: 587 },
    secure:   { type: Boolean, default: false },
    user:     { type: String, trim: true, default: null, select: false },
    password: { type: String, trim: true, default: null, select: false },
    apiKey:   { type: String, trim: true, default: null, select: false },
    from:     { type: String, trim: true, default: null }, // "Name <email>"
  },
  { _id: false }
);

// ── SMS Provider Sub-schema ───────────────────────────────────────────────────
const smsProviderSchema = new Schema(
  {
    isEnabled: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: ["twilio", "msg91", "fast2sms", "textlocal"],
      default: "twilio",
    },
    apiKey:    { type: String, trim: true, default: null, select: false },
    senderId:  { type: String, trim: true, default: null },
  },
  { _id: false }
);

// ── Shipping Rule Sub-schema ──────────────────────────────────────────────────
const shippingRuleSchema = new Schema(
  {
    name:            { type: String, trim: true },              // e.g. "Standard Delivery"
    isEnabled:       { type: Boolean, default: true },
    fee:             { type: Number, default: 0, min: 0 },      // flat fee
    freeThreshold:   { type: Number, default: 0, min: 0 },      // free above this amount
    estimatedDays:   { type: String, trim: true, default: null }, // e.g. "3-5"
    applicableTo: {
      type: String,
      enum: ["all", "domestic", "international"],
      default: "all",
    },
  },
  { _id: true }
);

// ── Tax Rule Sub-schema ───────────────────────────────────────────────────────
const taxRuleSchema = new Schema(
  {
    name:        { type: String, trim: true },           // e.g. "GST", "VAT"
    rate:        { type: Number, default: 0, min: 0, max: 100 },
    isInclusive: { type: Boolean, default: false },      // price already includes tax
    isEnabled:   { type: Boolean, default: true },
    appliesTo: {
      type: String,
      enum: ["all", "physical", "digital"],
      default: "all",
    },
  },
  { _id: true }
);

// ── Notification Preferences Sub-schema ───────────────────────────────────────
const notificationPrefsSchema = new Schema(
  {
    orderPlaced:    { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
    orderConfirmed: { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
    orderShipped:   { email: { type: Boolean, default: true }, sms: { type: Boolean, default: true  } },
    orderDelivered: { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
    orderCancelled: { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
    orderRefunded:  { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
    lowStock:       { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
    newReview:      { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
    newCustomer:    { email: { type: Boolean, default: true }, sms: { type: Boolean, default: false } },
  },
  { _id: false }
);

// ── Settings Schema ───────────────────────────────────────────────────────────
const settingsSchema = new Schema(
  {
    // ── Store Scope ───────────────────────────────────────────────────────────
    // Each store has its own settings document.
    // The default/platform store's settings act as global defaults.
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Settings must be scoped to a store."],
      unique: true, // one settings doc per store
      index: true,
    },

    // ── Regional ──────────────────────────────────────────────────────────────
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "INR",
      minlength: 3,
      maxlength: 3,
    },

    currencySymbol: {
      type: String,
      trim: true,
      default: "₹",
    },

    timezone: {
      type: String,
      trim: true,
      default: "Asia/Kolkata",
    },

    language: {
      type: String,
      trim: true,
      default: "en",
    },

    dateFormat: {
      type: String,
      trim: true,
      default: "DD/MM/YYYY",
    },

    // ── Order & Checkout ──────────────────────────────────────────────────────
    orderPrefix: {
      type: String,
      trim: true,
      uppercase: true,
      default: "ORD",
      maxlength: 10,
    },

    invoicePrefix: {
      type: String,
      trim: true,
      uppercase: true,
      default: "INV",
      maxlength: 10,
    },

    allowGuestCheckout: {
      type: Boolean,
      default: true,
    },

    // Auto-cancel unpaid orders after N minutes (0 = disabled)
    orderExpiryMinutes: {
      type: Number,
      default: 30,
      min: 0,
    },

    // Minimum order value to allow checkout
    minimumOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ── Inventory ─────────────────────────────────────────────────────────────
    // Send low-stock alert when quantity falls below this number
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    // Allow orders for out-of-stock products
    allowBackorders: {
      type: Boolean,
      default: false,
    },

    // ── Shipping ──────────────────────────────────────────────────────────────
    shippingRules: {
      type: [shippingRuleSchema],
      default: [],
    },

    // ── Tax ───────────────────────────────────────────────────────────────────
    taxRules: {
      type: [taxRuleSchema],
      default: [],
    },

    // Legacy flat rate — use taxRules[] for multi-tier tax
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    taxIncludedInPrice: {
      type: Boolean,
      default: false,
    },

    // ── Payment Gateways ──────────────────────────────────────────────────────
    paymentGateways: {
      razorpay:  { type: paymentGatewaySchema, default: () => ({}) },
      stripe:    { type: paymentGatewaySchema, default: () => ({}) },
      paypal:    { type: paymentGatewaySchema, default: () => ({}) },
      cashfree:  { type: paymentGatewaySchema, default: () => ({}) },
      cod: {                                         // Cash on Delivery
        isEnabled:    { type: Boolean, default: true },
        extraCharge:  { type: Number, default: 0, min: 0 },
        maxOrderValue: { type: Number, default: 0 }, // 0 = unlimited
      },
    },

    // ── Email Provider ────────────────────────────────────────────────────────
    emailProvider: {
      type: emailProviderSchema,
      default: () => ({}),
    },

    // ── SMS Provider ──────────────────────────────────────────────────────────
    smsProvider: {
      type: smsProviderSchema,
      default: () => ({}),
    },

    // ── Notifications ─────────────────────────────────────────────────────────
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    notificationPrefs: {
      type: notificationPrefsSchema,
      default: () => ({}),
    },

    supportEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    supportPhone: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Analytics & Tracking ──────────────────────────────────────────────────
    analyticsEnabled: {
      type: Boolean,
      default: true,
    },

    googleAnalyticsId: {
      type: String,
      trim: true,
      default: null,
    },

    facebookPixelId: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Reviews & Ratings ─────────────────────────────────────────────────────
    allowReviews: {
      type: Boolean,
      default: true,
    },

    // Only customers who have purchased can review
    reviewsRequirePurchase: {
      type: Boolean,
      default: true,
    },

    // Reviews go live immediately (false = require admin approval)
    autoApproveReviews: {
      type: Boolean,
      default: false,
    },

    // ── Coupons ───────────────────────────────────────────────────────────────
    couponsEnabled: {
      type: Boolean,
      default: true,
    },

    // Maximum discount a coupon can give (percentage, 0 = no cap)
    maxCouponDiscountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ── Maintenance ───────────────────────────────────────────────────────────
    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    maintenanceMessage: {
      type: String,
      trim: true,
      default: "We are under maintenance. Please check back later.",
    },

    // ── SEO / Meta ────────────────────────────────────────────────────────────
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 70,
      default: null,
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
      default: null,
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    favicon: {
      url:      { type: String, default: null },
      publicId: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
settingsSchema.index({ store: 1 }, { unique: true });

// ── Virtuals ──────────────────────────────────────────────────────────────────
settingsSchema.virtual("activePaymentGateways").get(function () {
  const gateways = [];
  const pg = this.paymentGateways;
  if (pg?.razorpay?.isEnabled) gateways.push("razorpay");
  if (pg?.stripe?.isEnabled)   gateways.push("stripe");
  if (pg?.paypal?.isEnabled)   gateways.push("paypal");
  if (pg?.cashfree?.isEnabled) gateways.push("cashfree");
  if (pg?.cod?.isEnabled)      gateways.push("cod");
  return gateways;
});

settingsSchema.virtual("defaultShippingRule").get(function () {
  return this.shippingRules?.find((r) => r.isEnabled) ?? null;
});

// ── Static Methods ────────────────────────────────────────────────────────────
/**
 * Get settings for a specific store.
 * Falls back to the default store settings if not found.
 * @param {mongoose.Types.ObjectId|string} storeId
 */
settingsSchema.statics.findByStore = function (storeId) {
  return this.findOne({ store: storeId });
};

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;