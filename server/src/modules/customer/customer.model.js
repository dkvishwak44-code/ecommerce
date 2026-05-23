/**
 * Customer Model
 * Represents end-user shoppers (storefront buyers).
 * Completely separate from the User model (admin panel users).
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { STATUS } from "../../constants/status.js";
// import { STATUS } from "../constants/status.js";


const { Schema } = mongoose;

// ── Address Sub-schema ────────────────────────────────────────────────────────
const addressSchema = new Schema(
  {
    label:      { type: String, trim: true, default: "Home" }, // Home | Work | Other
    line1:      { type: String, trim: true, required: true },
    line2:      { type: String, trim: true, default: null },
    city:       { type: String, trim: true, required: true },
    state:      { type: String, trim: true, required: true },
    postalCode: { type: String, trim: true, required: true },
    country:    { type: String, trim: true, default: "India" },
    phone:      { type: String, trim: true, default: null },   // delivery contact
    isDefault:  { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

// ── Customer Schema ───────────────────────────────────────────────────────────
const customerSchema = new Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────────
    name: {
      type:      String,
      required:  [true, "Name is required."],
      trim:      true,
      minlength: [2,  "Name must be at least 2 characters."],
      maxlength: [60, "Name cannot exceed 60 characters."],
    },

    email: {
      type:      String,
      required:  [true, "Email is required."],
      unique:    true,
      lowercase: true,
      trim:      true,
      index:     true,
    },

    phone: {
      type:    String,
      trim:    true,
      default: null,
      index:   true,
    },

    avatar: {
      url:      { type: String, default: null },
      publicId: { type: String, default: null }, // Cloudinary
    },

    dateOfBirth: { type: Date, default: null },

    gender: {
      type:    String,
      enum:    ["male", "female", "other", "prefer_not_to_say", null],
      default: null,
    },

    // ── Auth ──────────────────────────────────────────────────────────────────
    password: {
      type:      String,
      required:  [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters."],
      select:    false,
    },

    // ── Email Verification (OTP) ──────────────────────────────────────────────
    isVerified: { type: Boolean, default: false, index: true },

    otp: {
      code:      { type: String, default: null, select: false },
      expiresAt: { type: Date,   default: null, select: false },
      attempts:  { type: Number, default: 0,    select: false },
    },

    // ── Password Reset ────────────────────────────────────────────────────────
    passwordResetToken:   { type: String, default: null, select: false },
    passwordResetExpires: { type: Date,   default: null, select: false },

    // ── Refresh Token ─────────────────────────────────────────────────────────
    refreshToken: { type: String, default: null, select: false },

    // ── Account Status ────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.SUSPENDED, STATUS.BANNED],
      default: STATUS.ACTIVE,
      index:   true,
    },

    // ── Addresses ─────────────────────────────────────────────────────────────
    addresses: { type: [addressSchema], default: [] },

    // ── Preferences ───────────────────────────────────────────────────────────
    preferences: {
      newsletter:    { type: Boolean, default: true },
      smsAlerts:     { type: Boolean, default: false },
      pushAlerts:    { type: Boolean, default: true },
      orderUpdates:  { type: Boolean, default: true },
      promotions:    { type: Boolean, default: true },
      language:      { type: String, default: "en" },
      currency:      { type: String, default: "INR" },
    },

    // ── Activity ──────────────────────────────────────────────────────────────
    lastLoginAt:  { type: Date,   default: null },
    lastLoginIp:  { type: String, default: null },
    loginCount:   { type: Number, default: 0 },

    // ── Stats (denormalised for performance) ──────────────────────────────────
    stats: {
      totalOrders:   { type: Number, default: 0 },
      totalSpent:    { type: Number, default: 0 },
      totalReviews:  { type: Number, default: 0 },
      totalReturns:  { type: Number, default: 0 },
    },

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
customerSchema.index({ email: 1, isDeleted: 1 });
customerSchema.index({ status: 1, isVerified: 1 });
customerSchema.index({ createdAt: -1 });

// ── Virtuals ──────────────────────────────────────────────────────────────────
customerSchema.virtual("isActive").get(function () {
  return this.status === STATUS.ACTIVE && this.isVerified && !this.isDeleted;
});

customerSchema.virtual("defaultAddress").get(function () {
  return this.addresses?.find((a) => a.isDefault) ?? this.addresses?.[0] ?? null;
});

// ── Pre-save: Hash Password ───────────────────────────────────────────────────
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt    = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Pre-save: Single Default Address ─────────────────────────────────────────
customerSchema.pre("save", function (next) {
  if (!this.isModified("addresses")) return next();
  const defaults = this.addresses.filter((a) => a.isDefault);
  if (defaults.length > 1) {
    this.addresses.forEach((a) => (a.isDefault = false));
    this.addresses[this.addresses.length - 1].isDefault = true;
  }
  // Auto-default the first address if none is marked
  if (this.addresses.length === 1) {
    this.addresses[0].isDefault = true;
  }
  next();
});

// ── Pre-find: Exclude Soft-deleted ───────────────────────────────────────────
customerSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

// ── Instance Methods ──────────────────────────────────────────────────────────
customerSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

customerSchema.methods.clearOtp = async function () {
  this.otp = { code: null, expiresAt: null, attempts: 0 };
  return this.save();
};

customerSchema.methods.recordLogin = async function (ip = null) {
  this.lastLoginAt = new Date();
  this.lastLoginIp = ip;
  this.loginCount += 1;
  return this.save();
};

customerSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.status    = STATUS.INACTIVE;
  return this.save();
};

// ── Static Methods ────────────────────────────────────────────────────────────
customerSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email: email.toLowerCase() }).select("+password");
};

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;