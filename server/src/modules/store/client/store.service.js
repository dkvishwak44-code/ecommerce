/**
 * Client Store Service
 * Read-only operations for storefront store browsing.
 */

import * as storeRepo from "../store.repository.js";
import Product from "../../product/product.model.js";
import { AppError } from "../../../utils/AppError.js";
import { STORE_STATUS } from "../../../constants/status.js";

/**
 * List all active verified stores.
 */
export const getStores = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, parseInt(query.limit) || 20);
  const filter = {
    isActive: true,
    status: STORE_STATUS.VERIFIED,
  };

  return storeRepo.findAllStores({ filter, page, limit });
};

/**
 * Get store detail by slug.
 */
export const getStore = async (slug) => {
  const store = await storeRepo.findStoreBySlug(slug);
  if (!store) throw new AppError("Store not found.", 404);
  if (!store.isActive || store.status !== STORE_STATUS.VERIFIED) {
    throw new AppError("Store not found.", 404);
  }
  return { store };
};

/**
 * Get products belonging to a store.
 */
export const getStoreProducts = async (slug, query = {}) => {
  const store = await storeRepo.findStoreBySlug(slug);
  if (!store) throw new AppError("Store not found.", 404);

  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 12);
  const skip = (page - 1) * limit;

  const filter = {
    storeId: store._id,
    status: "active",
    isPublished: true,
  };

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    popular: { totalSales: -1 },
  };
  const sort = sortMap[query.sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    store: { _id: store._id, name: store.name, slug: store.slug, logo: store.logo },
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
