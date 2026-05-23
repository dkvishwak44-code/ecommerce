// modules/product/client/product.service.js

import Product from "../product.model.js";
import * as productRepository from "../product.repository.js";
import { AppError } from "../../../utils/AppError.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const activeFilter = { status: "active", isPublished: true };

const buildPaginationOptions = (query) => {
  const page     = Math.max(1, parseInt(query.page)  || 1);
  const limit    = Math.min(100, parseInt(query.limit) || 12);
  const skip     = (page - 1) * limit;
  const sortMap  = {
    newest:      { createdAt: -1 },
    oldest:      { createdAt:  1 },
    price_asc:   { price:      1 },
    price_desc:  { price:     -1 },
    rating:      { rating:    -1 },
    popular:     { totalSales:-1 },
  };
  const sort = sortMap[query.sort] || { createdAt: -1 };
  return { page, limit, skip, sort };
};

const buildPriceFilter = (query) => {
  const filter = {};
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  return filter;
};

const paginatedResponse = async (filter, options) => {
  const { page, limit, skip, sort } = options;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categoryId", "name slug")
      .populate("storeId",    "name logo")
      .populate("sellerId",   "name")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

// ─── Get All Products ─────────────────────────────────────────────────────────

export const getProducts = async (query = {}) => {
  const options = buildPaginationOptions(query);

  const filter = {
    ...activeFilter,
    ...buildPriceFilter(query),
  };

  if (query.category)  filter.categoryId = query.category;
  if (query.brand)     filter.brand      = query.brand;
  if (query.store)     filter.storeId    = query.store;
  if (query.tag)       filter.tags       = { $in: [query.tag] };
  if (query.featured)  filter.isFeatured = true;

  return paginatedResponse(filter, options);
};

// ─── Get Product By ID ────────────────────────────────────────────────────────

export const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, ...activeFilter })
    .populate("categoryId", "name slug")
    .populate("storeId",    "name logo")
    .populate("sellerId",   "name")
    .lean();

  if (!product) throw new AppError("Product not found", 404);
  return { product };
};

// ─── Get Product By Slug ──────────────────────────────────────────────────────

export const getProductBySlug = async (slug) => {
  const product = await productRepository.findOne({ slug, ...activeFilter });

  if (!product) throw new AppError("Product not found", 404);
  return { product };
};

// ─── Get Featured Products ────────────────────────────────────────────────────

export const getFeaturedProducts = async (query = {}) => {
  const options = buildPaginationOptions(query);
  const filter  = { ...activeFilter, isFeatured: true };
  return paginatedResponse(filter, options);
};

// ─── Get New Arrivals ─────────────────────────────────────────────────────────

export const getNewArrivals = async (query = {}) => {
  const options = buildPaginationOptions({ ...query, sort: "newest" });
  const filter  = { ...activeFilter };

  if (query.store) filter.storeId = query.store;

  return paginatedResponse(filter, options);
};

// ─── Get Best Sellers ─────────────────────────────────────────────────────────

export const getBestSellers = async (query = {}) => {
  const options = buildPaginationOptions({ ...query, sort: "popular" });
  const filter  = { ...activeFilter, totalSales: { $gt: 0 } };

  if (query.store) filter.storeId = query.store;

  return paginatedResponse(filter, options);
};

// ─── Get Related Products ─────────────────────────────────────────────────────

export const getRelatedProducts = async (productId, query = {}) => {
  const product = await productRepository.findById(productId).lean();
  if (!product) throw new AppError("Product not found", 404);

  const limit = parseInt(query.limit) || 8;

  const products = await Product.find({
    ...activeFilter,
    categoryId: product.categoryId,
    _id:        { $ne: productId },
  })
    .populate("categoryId", "name slug")
    .populate("storeId",    "name logo")
    .sort({ rating: -1, totalSales: -1 })
    .limit(limit)
    .lean();

  return { products };
};

// ─── Get Products By Category ─────────────────────────────────────────────────

export const getProductsByCategory = async (categoryId, query = {}) => {
  const options = buildPaginationOptions(query);
  const filter  = {
    ...activeFilter,
    ...buildPriceFilter(query),
    categoryId,
  };
  return paginatedResponse(filter, options);
};

// ─── Get Products By Brand ────────────────────────────────────────────────────

export const getProductsByBrand = async (brandId, query = {}) => {
  const options = buildPaginationOptions(query);
  const filter  = {
    ...activeFilter,
    ...buildPriceFilter(query),
    brand: brandId,
  };
  return paginatedResponse(filter, options);
};

// ─── Get Products By Store ────────────────────────────────────────────────────

export const getProductsByStore = async (storeId, query = {}) => {
  const options = buildPaginationOptions(query);
  const filter  = {
    ...activeFilter,
    ...buildPriceFilter(query),
    storeId,
  };
  return paginatedResponse(filter, options);
};

// ─── Search Products ──────────────────────────────────────────────────────────

export const searchProducts = async (query = {}) => {
  if (!query.q) throw new AppError("Search query is required", 400);

  const options = buildPaginationOptions(query);
  const filter  = {
    ...activeFilter,
    $text: { $search: query.q },
  };

  const { page, limit, skip } = options;

  const [products, total] = await Promise.all([
    Product.find(filter, { score: { $meta: "textScore" } })
      .populate("categoryId", "name slug")
      .populate("storeId",    "name logo")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

// ─── Get Banners ──────────────────────────────────────────────────────────────

export const getBanners = async (query = {}) => {
  // Banner model is in its own module — import dynamically to avoid coupling
  const { default: Banner } = await import("../../banner/banner.model.js");

  const filter = { isActive: true };
  if (query.store) filter.store = query.store;

  const banners = await Banner.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .limit(parseInt(query.limit) || 10)
    .lean();

  return { banners };
};

// ─── Get Home Page Data ───────────────────────────────────────────────────────

export const getHomeData = async (query = {}) => {
  const [banners, featured, newArrivals, bestSellers] = await Promise.all([
    getBanners(query),
    getFeaturedProducts({ ...query, limit: 8 }),
    getNewArrivals({     ...query, limit: 8 }),
    getBestSellers({     ...query, limit: 8 }),
  ]);

  return { banners, featured, newArrivals, bestSellers };
};