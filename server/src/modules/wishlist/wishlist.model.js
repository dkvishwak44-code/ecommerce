/**
 * Wishlist Model
 * One wishlist per customer. Stores product references with timestamps.
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

const wishlistItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const wishlistSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
      index: true,
    },

    items: { type: [wishlistItemSchema], default: [] },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
wishlistSchema.index({ "items.product": 1 });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
