import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },

    slug: {
      type:   String,
      unique: true,
      index:  true,
    },

    description:      { type: String, trim: true },
    shortDescription: { type: String, trim: true },

    sku: {
      type:     String,
      unique:   true,
      required: true,
      trim:     true,
    },

    price: {
      type:     Number,
      required: true,
      min:      0,
    },

    salePrice:  { type: Number, default: null, min: 0 },
    costPrice:  { type: Number, default: null, min: 0 },

    stock: {
      type:    Number,
      default: 0,
      min:     0,
    },

    lowStockThreshold: {
      type:    Number,
      default: 5,
      min:     0,
    },

    images: [
      {
        url:       { type: String, default: null },
        public_id: { type: String, default: null },
      },
    ],

    thumbnail: {
      url:       { type: String, default: null },
      public_id: { type: String, default: null },
    },

    // ── Category (string array) ───────────────────────────────
    category: {
      type:     [String],   // trim array strings pe kaam nahi karta
      required: true,
    },

    // ── Ownership ─────────────────────────────────────────────
    sellerId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref:   "User",
      index: true,
      default: null,
    },

    createdBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      index:    true,
    },

    storeId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Store",
      required: true,
      index:    true,
    },

    tags: [String],

    variants: [
      {
        name:  { type: String, trim: true },
        value: { type: String, trim: true },
        price: { type: Number, min: 0 },
        stock: { type: Number, min: 0, default: 0 },
      },
    ],

    attributes: [
      {
        name:  { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    seo: {
      metaTitle:       { type: String, trim: true, default: null },
      metaDescription: { type: String, trim: true, default: null },
      keywords:        [String],
    },

    rating:       { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    totalSales:   { type: Number, default: 0, min: 0 },

    isFeatured:  { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true  },

    status: {
      type:    String,
      enum:    ["draft", "active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────
productSchema.index({ name: "text", description: "text" }); // search
productSchema.index({ storeId: 1,   status: 1 });           // store filter
productSchema.index({ createdBy: 1, createdAt: -1 });       // creator list
productSchema.index({ sellerId: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model("Product", productSchema);