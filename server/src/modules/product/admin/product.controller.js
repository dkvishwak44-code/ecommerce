import * as service from "./product.service.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await service.createProduct(req);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Product created successfully.",
    result: { product },
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const result = await service.getAllProducts(req);
  return sendSuccess(res, {
    message: "Products fetched successfully.",
    result,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await service.getProductById(req);
  return sendSuccess(res, {
    message: "Product fetched successfully.",
    result: { product },
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await service.updateProduct(req);
  return sendSuccess(res, {
    message: "Product updated successfully.",
    result: { product },
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const result = await service.deleteProduct(req);
  return sendSuccess(res, {
    message: result.message,
  });
});
