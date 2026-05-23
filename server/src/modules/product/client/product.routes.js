// api/client/v1/product.routes.js

import express from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getRelatedProducts,
  getProductsByCategory,
  getProductsByBrand,
  getProductsByStore,
  searchProducts,
} from "../../../modules/product/client/product.controller.js";

const router = express.Router();

// ── Static routes first (before :id to avoid conflicts) ──────────────────────
router.get("/search",       searchProducts);
router.get("/featured",     getFeaturedProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-sellers", getBestSellers);

// ── Parameterised routes ──────────────────────────────────────────────────────
router.get("/slug/:slug",              getProductBySlug);
router.get("/category/:categoryId",    getProductsByCategory);
router.get("/brand/:brandId",          getProductsByBrand);
router.get("/store/:storeId",          getProductsByStore);
router.get("/:id/related",             getRelatedProducts);
router.get("/:id",                     getProductById);

// ── Base ──────────────────────────────────────────────────────────────────────
router.get("/", getProducts);

export default router;