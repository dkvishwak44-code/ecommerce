/**
 * Category Model
 * Supports nested parent → child hierarchy for navigation menus.
 * Soft-deletable. Slug-indexed for SEO-friendly URLs.
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters."],
      maxlength: [80, "Category name cannot exceed 80 characters."],
    },

    slug: {
      type: String,
      required: [true, "Category slug is required."],
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

    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    icon: { type: String, trim: true, default: null }, // CSS icon class or emoji

    // ── Hierarchy ─────────────────────────────────────────────────────────────
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    level: {
      type: Number,
      default: 0, // 0 = root, 1 = sub, 2 = sub-sub
      min: 0,
    },

    // ── Display ───────────────────────────────────────────────────────────────
    order: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: { type: Boolean, default: false },

    // ── Status ────────────────────────────────────────────────────────────────
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },

    // ── SEO ───────────────────────────────────────────────────────────────────
    seo: {
      metaTitle: { type: String, trim: true, default: null },
      metaDescription: { type: String, trim: true, default: null },
      keywords: [String],
    },

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
categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ slug: 1, isDeleted: 1 });
categorySchema.index({ isActive: 1, isDeleted: 1 });
categorySchema.index({ name: "text", description: "text" });

// ── Virtuals ──────────────────────────────────────────────────────────────────
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// ── Pre-find: Exclude Soft-deleted ────────────────────────────────────────────
categorySchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

// ── Instance Methods ──────────────────────────────────────────────────────────
categorySchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive = false;
  return this.save();
};

const Category = mongoose.model("Category", categorySchema);
export default Category;
