import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { MESSAGES } from "../../constants/messages.js";
import { HTTP_STATUS } from "../../constants/status.js";
import * as cartService from "./cart.service.js";

const getCustomerId = (req) => req.customer?._id || req.user?.id;

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(getCustomerId(req));

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.CART.FETCHED,
    result: { cart },
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(getCustomerId(req), req.body);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: MESSAGES.CART.ITEM_ADDED,
    result: { cart },
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItem(getCustomerId(req), req.params.itemId, req.body);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.CART.UPDATED,
    result: { cart },
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem(getCustomerId(req), req.params.itemId);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.CART.ITEM_REMOVED,
    result: { cart },
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(getCustomerId(req));

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.CART.CLEARED,
    result: { cart },
  });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.applyCoupon(getCustomerId(req), req.body);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.COUPON.APPLIED,
    result: { cart },
  });
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCoupon(getCustomerId(req));

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.COUPON.REMOVED,
    result: { cart },
  });
});
