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
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  getRelatedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  searchProducts,
  buyNow,
} from "../../../modules/product/public/product.controller.js";
import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { addToCartSchema } from "../../../modules/cart/cart.validation.js";

const router = Router();

// ── Discovery ─────────────────────────────────────────────────────────────────
router.get("/",                     getProducts);           // all products with filters
router.get("/search",               searchProducts);        // ?q=keyword full-text search
router.get("/featured",             getFeaturedProducts);
router.get("/new-arrivals",         getNewArrivals);        // sorted by createdAt desc
router.get("/best-sellers",         getBestSellers);        // sorted by soldCount desc

// ── Filtered Lists ────────────────────────────────────────────────────────────
router.get("/category/:category",   getProductsByCategory); // products in a category

// ── Single Product ────────────────────────────────────────────────────────────
// Must come after named routes to avoid slug clash
router.get("/:id/related",          getRelatedProducts);    // same category, diff product
router.get("/id/:id",               getProductById);
router.get("/:slug",                getProductBySlug);      // by slug (SEO friendly)

// ── Customer Actions ──────────────────────────────────────────────────────────
router.post("/:id/buy-now", customerAuthenticate, validate(addToCartSchema.partial({ productId: true })), buyNow);

export default router;
