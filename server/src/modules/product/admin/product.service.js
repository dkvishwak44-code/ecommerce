// modules/product/admin/product.service.js

import slugify from "slugify";

import Product from "../product.model.js";

import { auditLog } from "../../../utils/auditLogger.js";

export const createProduct = async (req) => {
  const payload = req.body;

  // check SKU
  const exists = await Product.findOne({
    sku: payload.sku,
  });

  if (exists) {
    throw new Error("SKU already exists");
  }

  // create
  const product = await Product.create({
    ...payload,

    slug: slugify(payload.name, {
      lower: true,
      strict: true,
    }),

    sellerId: req.user.sellerId,

    storeId: req.user.storeId,
  });

  // audit log
  auditLog({
    action: "CREATE",
    entity: "PRODUCT",
    entityId: product._id,
    req,
    changes: {
      after: product,
    },
  });

  return product;
};

export const getAllProducts = async (req) => {
  const query = {};

  // seller can see only own products
  if (req.user.role !== "superadmin") {
    query.sellerId = req.user.sellerId;
  }

  const products = await Product.find(query)
    .populate("categoryId")
    .populate("sellerId", "name email")
    .sort({ createdAt: -1 });

  return products;
};

export const getProductById = async (req) => {
  const product = await Product.findById(req.params.id)
    .populate("categoryId")
    .populate("sellerId", "name email");

  if (!product) {
    throw new Error("Product not found");
  }

  // ownership check
  if (
    req.user.role !== "superadmin" &&
    product.sellerId._id.toString() !== req.user.sellerId
  ) {
    throw new Error("Access denied");
  }

  return product;
};

export const updateProduct = async (req) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new Error("Product not found");
  }

  // ownership check
  if (
    req.user.role !== "superadmin" &&
    product.sellerId.toString() !== req.user.sellerId
  ) {
    throw new Error("Access denied");
  }

  const oldData = product.toObject();

  // update fields
  Object.assign(product, req.body);

  // update slug
  if (req.body.name) {
    product.slug = slugify(req.body.name, {
      lower: true,
      strict: true,
    });
  }

  await product.save();

  // audit log
  auditLog({
    action: "UPDATE",
    entity: "PRODUCT",
    entityId: product._id,
    req,
    changes: {
      before: oldData,
      after: product,
    },
  });

  return product;
};

export const deleteProduct = async (req) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new Error("Product not found");
  }

  // ownership check
  if (
    req.user.role !== "superadmin" &&
    product.sellerId.toString() !== req.user.sellerId
  ) {
    throw new Error("Access denied");
  }

  await product.deleteOne();

  // audit log
  auditLog({
    action: "DELETE",
    entity: "PRODUCT",
    entityId: product._id,
    req,
    changes: {
      before: product,
    },
  });

  return {
    message: "Product deleted successfully",
  };
};