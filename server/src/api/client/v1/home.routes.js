/**
 * Client Home Routes
 * Base: /api/client/v1/home
 *
 * Aggregated homepage data — banners, featured products, categories.
 * All public, heavily cached via Redis.
 */

import { Router } from "express";
import {
  // getHomePage,
  getBanners,
  getFeaturedProducts,
  // getFeaturedCategories,
  // getFeaturedBrands,
} from "../../../modules/product/client/product.controller.js";

const router = Router();

// Single call that returns everything the homepage needs (most common usage)
// router.get("/",                   getHomePage);

// Individual sections — for apps that lazy-load sections separately
router.get("/banners",            getBanners);
router.get("/featured-products",  getFeaturedProducts);
// router.get("/featured-categories",getFeaturedCategories);
// router.get("/featured-brands",    getFeaturedBrands);

export default router;