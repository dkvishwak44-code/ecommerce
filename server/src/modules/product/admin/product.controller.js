// modules/product/admin/product.controller.js

import * as service from "./product.service.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await service.createProduct(req);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await service.getAllProducts(req);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await service.getProductById(req);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await service.updateProduct(req);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const response = await service.deleteProduct(req);

    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (err) {
    next(err);
  }
};