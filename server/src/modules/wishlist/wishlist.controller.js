/**
 * Wishlist Controller
 * Thin layer — calls service, sends response.
 */

import * as wishlistService from "./wishlist.service.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { MESSAGES } from "../../constants/messages.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.customer._id);
  sendSuccess(res, {
    message: MESSAGES.WISHLIST.FETCHED,
    result: { wishlist },
  });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.addToWishlist(
    req.customer._id,
    req.params.productId
  );
  sendSuccess(res, {
    statusCode: 201,
    message: MESSAGES.WISHLIST.ITEM_ADDED,
    result: { wishlist },
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.removeFromWishlist(
    req.customer._id,
    req.params.productId
  );
  sendSuccess(res, {
    message: MESSAGES.WISHLIST.ITEM_REMOVED,
    result: { wishlist },
  });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.clearWishlist(req.customer._id);
  sendSuccess(res, {
    message: MESSAGES.WISHLIST.CLEARED,
    result: { wishlist },
  });
});

export const moveToCart = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.moveToCart(
    req.customer._id,
    req.params.productId
  );
  sendSuccess(res, {
    message: "Item moved to cart successfully.",
    result: { wishlist },
  });
});
