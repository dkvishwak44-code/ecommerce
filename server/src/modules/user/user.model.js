import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES, SYSTEM_ROLES } from "../../constants/roles.js";
import { STATUS } from "../../constants/status.js";
import { hashPassword } from "../../utils/hash.js";

const { Schema } = mongoose;

// ── Address Sub-schema ────────────────────────────────────────────────────────
const addressSchema = new Schema(
  {
    label:      { type: String, trim: true, default: "Home" },
    line1:      { type: String, trim: true },
    line2:      { type: String, trim: true },
    city:       { type: String, trim: true },
    state:      { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country:    { type: String, trim: true, default: "India" },
    isDefault:  { type: Boolean, default: false },
  },
  { _id: true }
);

// ── Social Links Sub-schema ───────────────────────────────────────────────────
const socialLinksSchema = new Schema(
  {
    facebook:  { type: String, trim: true, default: null },
    instagram: { type: String, trim: true, default: null },
    twitter:   { type: String, trim: true, default: null },
    linkedin:  { type: String, trim: true, default: null },
    youtube:   { type: String, trim: true, default: null },
  },
  { _id: false }
);

// ── User Schema ───────────────────────────────────────────────────────────────
const userSchema = new Schema(
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
    },

    avatar: {
      url:      { type: String, default: null },
      publicId: { type: String, default: null }, // Cloudinary public_id
    },

    // ── Auth ──────────────────────────────────────────────────────────────────
    // Stores the hashed password — system-generated or user-set, same field.
    // Never returned by queries (select: false).
    password: {
      type:      String,
      required:  [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters."],
      select:    false,
    },

    // ── System-created Account Flow ───────────────────────────────────────────
    // When a superadmin / admin / seller creates a user account:
    //   1. A random password is generated and hashed into `password`.
    //   2. The plain password is emailed to the user (never stored in DB).
    //   3. `isFirstLogin` is set to true.
    //
    // On every login auth.service.js checks this flag:
    //   → true  → return 403 { code: "FIRST_LOGIN_RESET_REQUIRED" }
    //             frontend redirects to /reset-password
    //   → false → normal access granted
    //
    // After the user sets a new password, call user.completeFirstLogin()
    // which sets this back to false.
    isFirstLogin: {
      type:    Boolean,
      default: false,
      index:   true,
    },

    // Who created this account (null for self-registered users).
    createdBy: {
      type:    Schema.Types.ObjectId,
      ref:     "User",
      default: null,
    },

    // ── Role & Permissions ────────────────────────────────────────────────────
    role: {
      type:     Schema.Types.ObjectId,
      ref:      "Role",
      required: [true, "Role is required."],
      index:    true,
    },

    // Cached role name — avoids a populate() on every middleware check.
    roleName: {
      type:    String,
      enum:    [...SYSTEM_ROLES, "custom"],
      default: ROLES.SELLER,
    },

    isSuperAdmin: {
      type:    Boolean,
      default: false,
      index:   true,
    },

    // ── Store Association ─────────────────────────────────────────────────────
    // null for superadmin / platform admins; ObjectId for sellers.
    store: {
      type:    Schema.Types.ObjectId,
      ref:     "Store",
      default: null,
      index:   true,
    },

    // ── Account Status ────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.SUSPENDED, STATUS.BANNED],
      default: STATUS.ACTIVE,
      index:   true,
    },

    // Self-registered users verify via OTP.
    // System-created users are pre-verified (admin confirmed the email).
    isVerified: { type: Boolean, default: false },
     isVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },

    // ── OTP ───────────────────────────────────────────────────────────────────
    otp: {
      code:      { type: String, default: null, select: false },
      expiresAt: { type: Date,   default: null, select: false },
      attempts:  { type: Number, default: 0,    select: false },
    },

    // ── Password Reset ────────────────────────────────────────────────────────
    passwordResetToken:   { type: String, default: null, select: false },
    passwordResetExpires: { type: Date,   default: null, select: false },

    // ── Refresh Token (hashed) ────────────────────────────────────────────────
    refreshToken: { type: String, default: null, select: false },

    // ── Profile ───────────────────────────────────────────────────────────────
    bio: {
      type:      String,
      trim:      true,
      maxlength: [300, "Bio cannot exceed 300 characters."],
      default:   null,
    },

    addresses:   { type: [addressSchema],   default: [] },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },

    // ── Activity Tracking ─────────────────────────────────────────────────────
    lastLoginAt: { type: Date,   default: null },
    lastLoginIp: { type: String, default: null },
    loginCount:  { type: Number, default: 0 },

    // ── Soft Delete ───────────────────────────────────────────────────────────
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date,    default: null },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
userSchema.index({ email: 1, isDeleted: 1 });
userSchema.index({ store: 1, status: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ isFirstLogin: 1, status: 1 }); // admin view: pending first-logins
userSchema.index({ createdAt: -1 });

// ── Virtuals ──────────────────────────────────────────────────────────────────
userSchema.virtual("isActive").get(function () {
  return this.status === STATUS.ACTIVE && !this.isDeleted;
});

userSchema.virtual("defaultAddress").get(function () {
  return this.addresses?.find((a) => a.isDefault) ?? this.addresses?.[0] ?? null;
});

// ── Pre-save: Hash Password ───────────────────────────────────────────────────
// Runs whenever `password` is modified — covers both system-generated
// passwords and user-set passwords identically.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  this.password = await hashPassword(this.password);

});


// ── Pre-save: Enforce Single Default Address ──────────────────────────────────
userSchema.pre("save", function () {
  if (!this.isModified("addresses")) return ;
  const defaults = this.addresses.filter((a) => a.isDefault);
  if (defaults.length > 1) {
    this.addresses.forEach((a) => (a.isDefault = false));
    this.addresses[this.addresses.length - 1].isDefault = true;
  }
  next();
});

// ── Pre-find: Exclude Soft-deleted Records ────────────────────────────────────
// Bypass with: query.setOptions({ includeDeleted: true })
userSchema.pre(/^find/, function () {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
});

// ── Instance Methods ──────────────────────────────────────────────────────────

/**
 * Compare a plain-text password against the stored hash.
 * Used in auth.service.js during login.
 * @param {string} plain
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

/**
 * Soft-delete the user.
 * Preserves the document for audit/order history purposes.
 */
userSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.status    = STATUS.INACTIVE;
  return this.save();
};

/**
 * Clear OTP fields after successful verification.
 */
userSchema.methods.clearOtp = async function () {
  this.otp = { code: null, expiresAt: null, attempts: 0 };
  return this.save();
};

/**
 * Record a successful login attempt.
 * @param {string|null} ip
 */
userSchema.methods.recordLogin = async function (ip = null) {
  this.lastLoginAt = new Date();
  this.lastLoginIp = ip;
  this.loginCount += 1;
  return this.save();
};

/**
 * Mark first-login flow as complete.
 *
 * Call this in auth.service.js AFTER the user successfully sets
 * a new password during the forced reset flow.
 * Once called, the user passes the isFirstLogin middleware check normally.
 */
userSchema.methods.completeFirstLogin = async function () {
  this.isFirstLogin = false;
  return this.save();
};

// ── Static Methods ────────────────────────────────────────────────────────────

/**
 * Find a user by email and include the (normally hidden) password field.
 * Used exclusively in login and password-comparison flows.
 * @param {string} email
 */
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email: email.toLowerCase() }).select("+password");
};

/**
 * Factory for admin / seller-created accounts.
 *
 * Flow:
 *  1. Generates a cryptographically random temporary password (plain text).
 *  2. Passes it into `password` — the pre-save hook hashes it automatically.
 *     The plain text is NEVER written to the database.
 *  3. Sets isFirstLogin: true  → forces password reset on first login.
 *  4. Sets isVerified: true    → admin already confirmed the email; skip OTP.
 *  5. Returns { user, plainPassword } so the calling service can hand
 *     `plainPassword` to the email queue without touching the DB again.
 *
 * Usage in user.service.js:
 *   const { user, plainPassword } = await User.createByAdmin({
 *     name, email, phone, role, roleName, store, createdBy: req.user._id,
 *   });
 *   await emailQueue.add("welcomeSystemUser", {
 *     userId:        user._id,
 *     name:          user.name,
 *     email:         user.email,
 *     plainPassword,             // included in welcome email, then discarded
 *   });
 *
 * @param {object} fields  Any valid userSchema field values.
 * @returns {Promise<{ user: Document, plainPassword: string }>}
 */
userSchema.statics.createByAdmin = async function (fields) {
  const { generatePassword } = await import("../../utils/generatePassword.js");
  const plainPassword = generatePassword(); // e.g. "Xk9#mPqR2!"

  const user = await this.create({
    ...fields,
    password:     plainPassword, // hashed by pre-save hook — plain never stored
    isFirstLogin: true,          // forces redirect to /reset-password on first login
    isVerified:   true,          // skip OTP — admin confirmed email
    status:       STATUS.ACTIVE,
  });

  return { user, plainPassword };
};

// ── Model ─────────────────────────────────────────────────────────────────────
const User = mongoose.model("User", userSchema);
export default User;