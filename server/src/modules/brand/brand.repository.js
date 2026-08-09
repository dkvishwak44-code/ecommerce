/**
 * Brand Repository
 * All direct DB queries for the Brand model.
 */

import Brand from "./brand.model.js";

export const findAll = async ({ filter = {}, sort = { name: 1 }, page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const [brands, total] = await Promise.all([
    Brand.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Brand.countDocuments(filter),
  ]);
  return { brands, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findById = (id) =>
  Brand.findById(id).lean();

export const findBySlug = (slug) =>
  Brand.findOne({ slug: slug.toLowerCase() }).lean();

export const create = (data) =>
  Brand.create(data);

export const updateById = (id, data) =>
  Brand.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();

export const softDelete = async (id) => {
  const brand = await Brand.findById(id);
  if (!brand) return null;
  return brand.softDelete();
};
