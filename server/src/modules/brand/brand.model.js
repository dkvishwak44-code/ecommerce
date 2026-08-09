/**
 * Brand Model
 * Represents product brands/manufacturers.
 * Soft-deletable. Slug-indexed for SEO-friendly URLs.
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required."],
      trim: true,
      minlength: [2, "Brand name must be at least 2 characters."],
      maxlength: [80, "Brand name cannot exceed 80 characters."],
    },

    slug: {
      type: String,
      required: [true, "Brand slug is required."],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters."],
      default: null,
    },

    logo: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    website: { type: String, trim: true, default: null },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },

    // ── Stats ─────────────────────────────────────────────────────────────────
    productCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
brandSchema.index({ slug: 1, isDeleted: 1 });
brandSchema.index({ isActive: 1, isDeleted: 1 });
brandSchema.index({ name: "text" });

// ── Pre-find: Exclude Soft-deleted ────────────────────────────────────────────
brandSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

// ── Instance Methods ──────────────────────────────────────────────────────────
brandSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive = false;
  return this.save();
};

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
