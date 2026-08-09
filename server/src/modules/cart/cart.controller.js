/**
 * Cart Controller
 * Thin layer — calls service, sends response.
 */

import * as cartService from "./cart.service.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { MESSAGES } from "../../constants/messages.js";
import { HTTP_STATUS } from "../../constants/status.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.customer._id);
  sendSuccess(res, {
    message: MESSAGES.CART.FETCHED,
    result: { cart },
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.customer._id, req.body);
  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: MESSAGES.CART.ITEM_ADDED,
    result: { cart },
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItem(
    req.customer._id,
    req.params.itemId,
    req.body
  );
  sendSuccess(res, {
    message: MESSAGES.CART.UPDATED,
    result: { cart },
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem(req.customer._id, req.params.itemId);
  sendSuccess(res, {
    message: MESSAGES.CART.ITEM_REMOVED,
    result: { cart },
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.customer._id);
  sendSuccess(res, {
    message: MESSAGES.CART.CLEARED,
    result: { cart },
  });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.applyCoupon(req.customer._id, req.body);
  sendSuccess(res, {
    message: MESSAGES.COUPON.APPLIED,
    result: { cart },
  });
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCoupon(req.customer._id);
  sendSuccess(res, {
    message: MESSAGES.COUPON.REMOVED,
    result: { cart },
  });
});
