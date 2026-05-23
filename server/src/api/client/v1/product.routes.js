/**
 * Client Product Routes
 * Base: /api/client/v1/products
 *
 * All routes are public (no auth required) — customers browse without login.
 * Search, filters, pagination handled via query params.
 *
 * ?page=1&limit=20&sort=-createdAt
 * ?category=<id>&brand=<id>&minPrice=100&maxPrice=5000
 * ?q=shoes&inStock=true&rating=4
 */

import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductsByBrand,
  getRelatedProducts,
  getNewArrivals,
  getBestSellers,
  searchProducts,
} from "../../../modules/product/client/product.controller.js";
const router = Router();

// ── Discovery ─────────────────────────────────────────────────────────────────
router.get("/",                     getProducts);           // all products with filters
router.get("/search",               searchProducts);        // ?q=keyword full-text search
router.get("/new-arrivals",         getNewArrivals);        // sorted by createdAt desc
router.get("/best-sellers",         getBestSellers);        // sorted by soldCount desc

// ── Filtered Lists ────────────────────────────────────────────────────────────
router.get("/category/:slug",       getProductsByCategory); // products in a category
router.get("/brand/:slug",          getProductsByBrand);    // products by brand

// ── Single Product ────────────────────────────────────────────────────────────
// Must come after named routes to avoid slug clash
router.get("/:slug",                getProductBySlug);            // by slug (SEO friendly)
router.get("/:id/related",          getRelatedProducts);    // same category, diff product

export default router;