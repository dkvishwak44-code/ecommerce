// modules/product/client/product.controller.js

import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess }  from "../../../utils/response.js";
import * as productService from "./product.service.js";

export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);
  return sendSuccess(res, result, "Products fetched successfully", 200);
});

export const getProductById = asyncHandler(async (req, res) => {
  const result = await productService.getProductById(req.params.id);
  return sendSuccess(res, result, "Product fetched successfully", 200);
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const result = await productService.getProductBySlug(req.params.slug);
  return sendSuccess(res, result, "Product fetched successfully", 200);
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const result = await productService.getFeaturedProducts(req.query);
  return sendSuccess(res, result, "Featured products fetched successfully", 200);
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const result = await productService.getNewArrivals(req.query);
  return sendSuccess(res, result, "New arrivals fetched successfully", 200);
});

export const getBestSellers = asyncHandler(async (req, res) => {
  const result = await productService.getBestSellers(req.query);
  return sendSuccess(res, result, "Best sellers fetched successfully", 200);
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const result = await productService.getRelatedProducts(req.params.id, req.query);
  return sendSuccess(res, result, "Related products fetched successfully", 200);
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const result = await productService.getProductsByCategory(req.params.categoryId, req.query);
  return sendSuccess(res, result, "Products fetched successfully", 200);
});

export const getProductsByBrand = asyncHandler(async (req, res) => {
  const result = await productService.getProductsByBrand(req.params.brandId, req.query);
  return sendSuccess(res, result, "Products fetched successfully", 200);
});

export const getProductsByStore = asyncHandler(async (req, res) => {
  const result = await productService.getProductsByStore(req.params.storeId, req.query);
  return sendSuccess(res, result, "Products fetched successfully", 200);
});

export const searchProducts = asyncHandler(async (req, res) => {
  const result = await productService.searchProducts(req.query);
  return sendSuccess(res, result, "Search results fetched successfully", 200);
});

export const getBanners = asyncHandler(async (req, res) => {
  const result = await productService.getBanners(req.query);
  return sendSuccess(res, result, "Banners fetched successfully", 200);
});

export const getHomeData = asyncHandler(async (req, res) => {
  const result = await productService.getHomeData(req.query);
  return sendSuccess(res, result, "Home data fetched successfully", 200);
});