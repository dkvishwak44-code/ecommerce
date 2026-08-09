/**
 * Wishlist Service
 * Business logic for customer wishlist operations.
 */

import * as wishlistRepo from "./wishlist.repository.js";
import Product from "../product/product.model.js";
import * as cartService from "../cart/cart.service.js";
import { AppError } from "../../utils/AppError.js";
import { MESSAGES } from "../../constants/messages.js";

export const getWishlist = async (customerId) => {
  const wishlist = await wishlistRepo.findByCustomer(customerId);
  if (!wishlist) return { items: [] };
  return wishlist;
};

export const addToWishlist = async (customerId, productId) => {
  const product = await Product.findById(productId).lean();
  if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

  // Check if already in wishlist
  const existing = await wishlistRepo.getOrCreateWishlist(customerId);
  const alreadyExists = existing.items.some(
    (item) => item.product.toString() === productId
  );
  if (alreadyExists) {
    throw new AppError(MESSAGES.WISHLIST.ALREADY_EXISTS, 409);
  }

  const wishlist = await wishlistRepo.addProduct(customerId, productId);
  return wishlist;
};

export const removeFromWishlist = async (customerId, productId) => {
  const wishlist = await wishlistRepo.removeProduct(customerId, productId);
  if (!wishlist) throw new AppError(MESSAGES.WISHLIST.NOT_FOUND, 404);
  return wishlist;
};

export const clearWishlist = async (customerId) => {
  await wishlistRepo.clearWishlist(customerId);
  return { items: [] };
};

export const moveToCart = async (customerId, productId) => {
  // Add to cart
  await cartService.addToCart(customerId, { productId, quantity: 1 });

  // Remove from wishlist
  const wishlist = await wishlistRepo.removeProduct(customerId, productId);

  return wishlist;
};
