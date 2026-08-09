/**
 * Review Model
 * Product reviews with ratings, images, and moderation.
 * Only approved reviews appear on the storefront.
 */

import mongoose from "mongoose";
import { REVIEW_STATUS } from "../../constants/status.js";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    rating: {
      type: Number,
      required: [true, "Rating is required."],
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating cannot exceed 5."],
    },

    title: {
      type: String,
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters."],
      default: null,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters."],
      default: null,
    },

    images: [
      {
        url: { type: String },
        publicId: { type: String, default: null },
      },
    ],

    // ── Moderation ────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.PENDING,
      index: true,
    },

    isVerifiedPurchase: { type: Boolean, default: false },

    // Admin reply
    reply: {
      comment: { type: String, trim: true, default: null },
      repliedAt: { type: Date, default: null },
      repliedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },

    // ── Helpful votes ─────────────────────────────────────────────────────────
    helpfulCount: { type: Number, default: 0, min: 0 },

    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
reviewSchema.index({ product: 1, customer: 1 }, { unique: true }); // one review per product per customer
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ customer: 1, createdAt: -1 });

// ── Pre-find: Exclude Soft-deleted ────────────────────────────────────────────
reviewSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

// ── Static: Recalculate product rating ────────────────────────────────────────
reviewSchema.statics.recalculateProductRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: REVIEW_STATUS.APPROVED,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const { avgRating = 0, totalReviews = 0 } = result[0] || {};

  const Product = mongoose.model("Product");
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avgRating * 10) / 10,
    totalReviews,
  });

  return { avgRating: Math.round(avgRating * 10) / 10, totalReviews };
};

const Review = mongoose.model("Review", reviewSchema);
export default Review;
