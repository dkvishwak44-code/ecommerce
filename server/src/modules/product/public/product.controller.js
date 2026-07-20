import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";
import { MESSAGES } from "../../../constants/messages.js";
import { HTTP_STATUS } from "../../../constants/status.js";
import * as publicProductService from "./product.service.js";
import * as cartService from "../../cart/cart.service.js";

const getCustomerId = (req) => req.customer?._id || req.user?.id;

export const getProducts = asyncHandler(async (req, res) => {
  const result = await publicProductService.getProducts(req.query);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.PRODUCT.LIST_FETCHED,
    result,
  });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const result = await publicProductService.searchProducts(req.query);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: "Search results fetched successfully.",
    result,
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const result = await publicProductService.getFeaturedProducts(req.query);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: "Featured products fetched successfully.",
    result,
  });
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const result = await publicProductService.getNewArrivals(req.query);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: "New arrivals fetched successfully.",
    result,
  });
});

export const getBestSellers = asyncHandler(async (req, res) => {
  const result = await publicProductService.getBestSellers(req.query);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: "Best sellers fetched successfully.",
    result,
  });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const result = await publicProductService.getProductsByCategory(req.params.category, req.query);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.PRODUCT.LIST_FETCHED,
    result,
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const result = await publicProductService.getProductBySlug(req.params.slug);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.PRODUCT.FETCHED,
    result,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const result = await publicProductService.getProductById(req.params.id);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.PRODUCT.FETCHED,
    result,
  });
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const result = await publicProductService.getRelatedProducts(req.params.id, req.query);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: "Related products fetched successfully.",
    result,
  });
});

export const buyNow = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(getCustomerId(req), {
    productId: req.params.id,
    variantId: req.body.variantId || null,
    quantity: req.body.quantity || 1,
  });

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: "Product added to cart. Ready for checkout.",
    result: { cart, checkoutReady: true },
  });
});
