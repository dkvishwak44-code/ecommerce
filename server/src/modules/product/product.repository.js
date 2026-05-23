// modules/product/product.repository.js

import Product from "./product.model.js";

export const create = (payload) => Product.create(payload);

export const findById = (id) => Product.findById(id);

export const findOne = (query) => Product.findOne(query);

export const updateById = (id, payload) =>
  Product.findByIdAndUpdate(id, payload, {
    new: true,
  });

export const deleteById = (id) => Product.findByIdAndDelete(id);

export const paginate = (query, options = {}) =>
  Product.find(query)
    .skip(options.skip || 0)
    .limit(options.limit || 10)
    .sort(options.sort || { createdAt: -1 });