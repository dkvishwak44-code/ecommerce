import mongoose from "mongoose";
import { STATUS, STORE_STATUS } from "../../constants/status.js";

const { Schema } = mongoose;

// ── Address Sub-schema ────────────────────────────────────────────────────────
const storeAddressSchema = new Schema(
  {
    line1:      { type: String, trim: true, default: null },
    line2:      { type: String, trim: true, default: null },
    city:       { type: String, trim: true, default: null },
    state:      { type: String, trim: true, default: null },
    postalCode: { type: String, trim: true, default: null },
    country:    { type: String, trim: true, default: "India" },
    latitude:   { type: Number, default: null },
    longitude:  { type: Number, default: null },
  },
  { _id: false }
);

// ── Bank / Payout Details Sub-schema ─────────────────────────────────────────
const bankDetailsSchema = new Schema(
  {
    accountHolderName: { type: String, trim: true, default: null },
    accountNumber:     { type: String, trim: true, default: null, select: false },
    ifscCode:          { type: String, trim: true, default: null, select: false },
    bankName:          { type: String, trim: true, default: null },
    upiId:             { type: String, trim: true, default: null, select: false },
  },
  { _id: false }
);

// ── Social Links Sub-schema ───────────────────────────────────────────────────
const storeSocialLinksSchema = new Schema(
  {
    website:   { type: String, trim: true, default: null },
    facebook:  { type: String, trim: true, default: null },
    instagram: { type: String, trim: true, default: null },
    twitter:   { type: String, trim: true, default: null },
    youtube:   { type: String, trim: true, default: null },
  },
  { _id: false }
);

// ── Operating Hours Sub-schema ────────────────────────────────────────────────
const dayHoursSchema = new Schema(
  {
    open:  { type: String, default: "09:00" }, // HH:mm
    close: { type: String, default: "18:00" },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const operatingHoursSchema = new Schema(
  {
    monday:    { type: dayHoursSchema, default: () => ({}) },
    tuesday:   { type: dayHoursSchema, default: () => ({}) },
    wednesday: { type: dayHoursSchema, default: () => ({}) },
    thursday:  { type: dayHoursSchema, default: () => ({}) },
    friday:    { type: dayHoursSchema, default: () => ({}) },
    saturday:  { type: dayHoursSchema, default: () => ({ isClosed: true }) },
    sunday:    { type: dayHoursSchema, default: () => ({ isClosed: true }) },
  },
  { _id: false }
);

// ── Aggregate Stats Sub-schema ────────────────────────────────────────────────
const storeMetaSchema = new Schema(
  {
    totalProducts: { type: Number, default: 0, min: 0 },
    totalOrders:   { type: Number, default: 0, min: 0 },
    totalRevenue:  { type: Number, default: 0, min: 0 },
    totalReviews:  { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { _id: false }
);

// ── Store Schema ──────────────────────────────────────────────────────────────
const storeSchema = new Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Store name is required."],
      trim: true,
      minlength: [2, "Store name must be at least 2 characters."],
      maxlength: [100, "Store name cannot exceed 100 characters."],
    },

    slug: {
      type: String,
      required: [true, "Store slug is required."],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters."],
      default: null,
    },

    tagline: {
      type: String,
      trim: true,
      maxlength: [150, "Tagline cannot exceed 150 characters."],
      default: null,
    },

    // ── Media ─────────────────────────────────────────────────────────────────
    logo: {
      url:      { type: String, default: null },
      publicId: { type: String, default: null },
    },

    coverImage: {
      url:      { type: String, default: null },
      publicId: { type: String, default: null },
    },

    // ── Ownership ─────────────────────────────────────────────────────────────
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Store owner is required."],
      index: true,
    },

    // Team members with access to this store (sellers/staff)
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: Schema.Types.ObjectId, ref: "Role" },
        addedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Contact ───────────────────────────────────────────────────────────────
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
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

    country: {
      type: String,
      trim: true,
      default: "India",
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

    // ── Location & Hours ──────────────────────────────────────────────────────
    address:          { type: storeAddressSchema,    default: () => ({}) },
    operatingHours:   { type: operatingHoursSchema,  default: () => ({}) },

    // ── Financials ────────────────────────────────────────────────────────────
    bankDetails:      { type: bankDetailsSchema,     default: () => ({}) },

    // Commission the platform charges this store (percentage)
    commissionRate: {
      type: Number,
      default: 0,
      min: [0, "Commission rate cannot be negative."],
      max: [100, "Commission rate cannot exceed 100%."],
    },

    // ── Social & Web ──────────────────────────────────────────────────────────
    socialLinks:      { type: storeSocialLinksSchema, default: () => ({}) },

    // ── Status & Verification ─────────────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(STORE_STATUS),
      default: STORE_STATUS.PENDING,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Platform's default company store — set during bootstrap
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: { type: Date, default: null },

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Aggregate Stats ───────────────────────────────────────────────────────
    meta: { type: storeMetaSchema, default: () => ({}) },

    // ── Soft Delete ───────────────────────────────────────────────────────────
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date,    default: null },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
storeSchema.index({ slug: 1, isDeleted: 1 });
storeSchema.index({ owner: 1, isDeleted: 1 });
storeSchema.index({ status: 1, isActive: 1 });
storeSchema.index({ createdAt: -1 });

// ── Virtuals ──────────────────────────────────────────────────────────────────
storeSchema.virtual("isOpen").get(function () {
  return this.isActive && this.isVerified && !this.isDeleted;
});

storeSchema.virtual("fullAddress").get(function () {
  const a = this.address;
  if (!a) return null;
  return [a.line1, a.line2, a.city, a.state, a.postalCode, a.country]
    .filter(Boolean)
    .join(", ");
});

// ── Pre-find: Exclude Soft-deleted Records ────────────────────────────────────
storeSchema.pre(/^find/, function () {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
});

// ── Instance Methods ──────────────────────────────────────────────────────────
storeSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive  = false;
  return this.save();
};

storeSchema.methods.verify = async function (adminId) {
  this.isVerified = true;
  this.status     = STORE_STATUS.VERIFIED;
  this.verifiedAt = new Date();
  this.verifiedBy = adminId;
  return this.save();
};

storeSchema.methods.reject = async function (reason = null) {
  this.status          = STORE_STATUS.REJECTED;
  this.rejectionReason = reason;
  return this.save();
};

// ── Static Methods ────────────────────────────────────────────────────────────
storeSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: slug.toLowerCase() });
};

storeSchema.statics.findDefault = function () {
  return this.findOne({ isDefault: true });
};

const Store = mongoose.model("Store", storeSchema);
export default Store;