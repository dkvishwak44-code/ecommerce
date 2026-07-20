import Product from "../product.model.js";
import { AppError } from "../../../utils/AppError.js";
import { MESSAGES } from "../../../constants/messages.js";

const activeFilter = { status: "active", isPublished: true };

const publicProductSelect = "-costPrice -createdBy -__v";

const buildPagination = (query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 12, 1), 100);
  const skip = (page - 1) * limit;
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    popular: { totalSales: -1 },
  };

  return {
    page,
    limit,
    skip,
    sort: sortMap[query.sort] || sortMap.newest,
  };
};

const buildFilters = (query = {}) => {
  const filter = { ...activeFilter };

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.category) filter.category = query.category;
  if (query.store) filter.storeId = query.store;
  if (query.tag) filter.tags = { $in: [query.tag] };
  if (query.featured === "true" || query.featured === true) filter.isFeatured = true;
  if (query.inStock === "true" || query.inStock === true) filter.stock = { $gt: 0 };
  if (query.rating) filter.rating = { $gte: Number(query.rating) };

  return filter;
};

const paginateProducts = async (filter, query = {}, projection = publicProductSelect) => {
  const { page, limit, skip, sort } = buildPagination(query);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select(projection)
      .populate("storeId", "name logo slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getProducts = (query = {}) => {
  return paginateProducts(buildFilters(query), query);
};

export const searchProducts = (query = {}) => {
  if (!query.q?.trim()) {
    throw new AppError("Search query is required.", 400);
  }

  const { page, limit, skip } = buildPagination(query);
  const filter = {
    ...buildFilters(query),
    $text: { $search: query.q.trim() },
  };

  return Promise.all([
    Product.find(filter, { score: { $meta: "textScore" } })
      .select(publicProductSelect)
      .populate("storeId", "name logo slug")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]).then(([products, total]) => {
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  });
};

export const getFeaturedProducts = (query = {}) => {
  return paginateProducts({ ...buildFilters(query), isFeatured: true }, query);
};

export const getNewArrivals = (query = {}) => {
  return paginateProducts(buildFilters(query), { ...query, sort: "newest" });
};

export const getBestSellers = (query = {}) => {
  return paginateProducts(
    { ...buildFilters(query), totalSales: { $gt: 0 } },
    { ...query, sort: "popular" }
  );
};

export const getProductsByCategory = (category, query = {}) => {
  return paginateProducts({ ...buildFilters(query), category }, query);
};

export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, ...activeFilter })
    .select(publicProductSelect)
    .populate("storeId", "name logo slug")
    .lean();

  if (!product) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
  }

  return { product };
};

export const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, ...activeFilter })
    .select(publicProductSelect)
    .populate("storeId", "name logo slug")
    .lean();

  if (!product) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
  }

  return { product };
};

export const getRelatedProducts = async (productId, query = {}) => {
  const product = await Product.findOne({ _id: productId, ...activeFilter }).lean();

  if (!product) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
  }

  const limit = Math.min(Number.parseInt(query.limit, 10) || 8, 24);

  const products = await Product.find({
    ...activeFilter,
    _id: { $ne: productId },
    category: { $in: product.category || [] },
  })
    .select(publicProductSelect)
    .populate("storeId", "name logo slug")
    .sort({ rating: -1, totalSales: -1 })
    .limit(limit)
    .lean();

  return { products };
};
