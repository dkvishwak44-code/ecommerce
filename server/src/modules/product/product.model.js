// modules/product/product.model.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: String,

    shortDescription: String,

    sku: {
      type: String,
      unique: true,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    salePrice: Number,

    costPrice: Number,

    stock: {
      type: Number,
      default: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    thumbnail: {
      url: String,
      public_id: String,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    tags: [String],

    variants: [
      {
        name: String,
        value: String,
        price: Number,
        stock: Number,
      },
    ],

    attributes: [
      {
        name: String,
        value: String,
      },
    ],

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", description: "text" });

productSchema.index({ sellerId: 1 });

productSchema.index({ storeId: 1 });

productSchema.index({ categoryId: 1 });

productSchema.index({ slug: 1 });

productSchema.index({ sku: 1 });

productSchema.index({ createdAt: -1 });

export default mongoose.model("Product", productSchema);