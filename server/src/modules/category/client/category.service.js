/**
 * Client Category Service
 * Read-only operations for storefront category browsing.
 */

import * as categoryRepo from "../category.repository.js";
import { AppError } from "../../../utils/AppError.js";

/**
 * Get flat paginated list of active categories.
 */
export const getCategories = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 50);
  const filter = { isActive: true };

  if (query.parent) filter.parent = query.parent;
  if (query.featured) filter.isFeatured = true;
  if (query.level !== undefined) filter.level = parseInt(query.level);

  return categoryRepo.findAll({ filter, page, limit });
};

/**
 * Get single category by slug with its sub-categories.
 */
export const getCategory = async (slug) => {
  const category = await categoryRepo.findBySlug(slug);
  if (!category) throw new AppError("Category not found.", 404);

  // Fetch immediate children
  const children = await categoryRepo.findChildren(category._id);

  return { category, children };
};

/**
 * Get nested category tree for navigation menu.
 */
export const getCategoryTree = async () => {
  const tree = await categoryRepo.findTree();
  return { tree };
};
