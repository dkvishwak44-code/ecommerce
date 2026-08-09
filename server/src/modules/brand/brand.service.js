/**
 * Client Brand Service
 * Read-only operations for storefront brand browsing.
 */

import * as brandRepo from "./brand.repository.js";
import { AppError } from "../../utils/AppError.js";

/**
 * Get all active brands.
 */
export const getBrands = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 50);
  const filter = { isActive: true };

  if (query.featured) filter.isFeatured = true;

  return brandRepo.findAll({ filter, page, limit });
};

/**
 * Get single brand by slug.
 */
export const getBrand = async (slug) => {
  const brand = await brandRepo.findBySlug(slug);
  if (!brand) throw new AppError("Brand not found.", 404);
  return { brand };
};
