/**
 * Banner Model
 * Homepage hero banners with scheduling, ordering, and store association.
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters."],
      default: null,
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: [250, "Subtitle cannot exceed 250 characters."],
      default: null,
    },

    image: {
      url: { type: String, required: [true, "Banner image is required."] },
      publicId: { type: String, default: null },
    },

    mobileImage: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    link: { type: String, trim: true, default: null }, // internal or external URL
    linkText: { type: String, trim: true, default: null }, // CTA button text

    // ── Display ───────────────────────────────────────────────────────────────
    order: { type: Number, default: 0, min: 0 },
    position: {
      type: String,
      enum: ["hero", "sidebar", "inline", "popup"],
      default: "hero",
    },

    // ── Scheduling ────────────────────────────────────────────────────────────
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },

    // ── Status ────────────────────────────────────────────────────────────────
    isActive: { type: Boolean, default: true, index: true },

    // ── Association ───────────────────────────────────────────────────────────
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
bannerSchema.index({ isActive: 1, order: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
