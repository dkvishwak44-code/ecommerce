/**
 * Category Repository
 * All direct DB queries for the Category model.
 */

import Category from "./category.model.js";

// ── Read ──────────────────────────────────────────────────────────────────────

export const findAll = async ({ filter = {}, sort = { order: 1, name: 1 }, page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const [categories, total] = await Promise.all([
    Category.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Category.countDocuments(filter),
  ]);
  return { categories, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findById = (id) =>
  Category.findById(id).lean();

export const findBySlug = (slug) =>
  Category.findOne({ slug: slug.toLowerCase() }).lean();

export const findChildren = (parentId) =>
  Category.find({ parent: parentId, isActive: true })
    .sort({ order: 1, name: 1 })
    .lean();

/**
 * Build a nested tree of all active categories.
 * Returns root categories with nested `children` arrays.
 */
export const findTree = async () => {
  const all = await Category.find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .lean();

  // Build map
  const map = {};
  all.forEach((cat) => {
    map[cat._id.toString()] = { ...cat, children: [] };
  });

  // Nest children under parents
  const tree = [];
  all.forEach((cat) => {
    const node = map[cat._id.toString()];
    if (cat.parent) {
      const parentNode = map[cat.parent.toString()];
      if (parentNode) parentNode.children.push(node);
      else tree.push(node); // orphan → treat as root
    } else {
      tree.push(node);
    }
  });

  return tree;
};

// ── Write ─────────────────────────────────────────────────────────────────────

export const create = (data) =>
  Category.create(data);

export const updateById = (id, data) =>
  Category.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();

export const softDelete = async (id) => {
  const category = await Category.findById(id);
  if (!category) return null;
  return category.softDelete();
};
