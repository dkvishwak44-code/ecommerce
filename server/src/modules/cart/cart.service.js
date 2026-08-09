/**
 * Cart Service
 * Business logic for customer shopping cart operations.
 */

import * as cartRepo from "./cart.repository.js";
import Product from "../product/product.model.js";
import Coupon from "../coupon/coupon.model.js";
import { AppError } from "../../utils/AppError.js";
import { MESSAGES } from "../../constants/messages.js";

// ── Get Cart ──────────────────────────────────────────────────────────────────

export const getCart = async (customerId) => {
  const cart = await cartRepo.findByCustomer(customerId);
  if (!cart) return { items: [], subtotal: 0, discount: 0, tax: 0, total: 0, itemCount: 0, coupon: null };
  return cart;
};

// ── Add To Cart ───────────────────────────────────────────────────────────────

export const addToCart = async (customerId, { productId, quantity = 1, variant }) => {
  const product = await Product.findById(productId).lean();
  if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
  if (product.status !== "active" || !product.isPublished) {
    throw new AppError("Product is not available.", 400);
  }
  if (product.stock < quantity) {
    throw new AppError(MESSAGES.PRODUCT.OUT_OF_STOCK, 400);
  }

  const cart = await cartRepo.getOrCreateCart(customerId);

  // Check if item already in cart
  const existingIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingIndex >= 0) {
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > product.stock) {
      throw new AppError(`Only ${product.stock} items available in stock.`, 400);
    }
    cart.items[existingIndex].quantity = Math.min(newQty, 50);
    cart.items[existingIndex].price = product.price;
    cart.items[existingIndex].salePrice = product.salePrice;
  } else {
    cart.items.push({
      product: productId,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      quantity,
      variant: variant || {},
      thumbnail: product.thumbnail?.url || product.images?.[0]?.url || null,
    });
  }

  cart.recalculate();
  await cart.save();

  return cartRepo.findByCustomer(customerId);
};

// ── Update Cart Item ──────────────────────────────────────────────────────────

export const updateCartItem = async (customerId, itemId, { quantity }) => {
  const cart = await cartRepo.getOrCreateCart(customerId);

  const item = cart.items.id(itemId);
  if (!item) throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);

  // Validate stock
  const product = await Product.findById(item.product).lean();
  if (product && quantity > product.stock) {
    throw new AppError(`Only ${product.stock} items available in stock.`, 400);
  }

  item.quantity = quantity;
  if (product) {
    item.price = product.price;
    item.salePrice = product.salePrice;
  }

  cart.recalculate();
  await cart.save();

  return cartRepo.findByCustomer(customerId);
};

// ── Remove Cart Item ──────────────────────────────────────────────────────────

export const removeCartItem = async (customerId, itemId) => {
  const cart = await cartRepo.getOrCreateCart(customerId);

  const item = cart.items.id(itemId);
  if (!item) throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);

  cart.items.pull(itemId);
  cart.recalculate();
  await cart.save();

  return cartRepo.findByCustomer(customerId);
};

// ── Clear Cart ────────────────────────────────────────────────────────────────

export const clearCart = async (customerId) => {
  const cart = await cartRepo.getOrCreateCart(customerId);
  cart.items = [];
  cart.recalculate();
  await cart.save();
  return { items: [], subtotal: 0, discount: 0, tax: 0, total: 0, itemCount: 0, coupon: null };
};

// ── Apply Coupon ──────────────────────────────────────────────────────────────

export const applyCoupon = async (customerId, { code }) => {
  const cart = await cartRepo.getOrCreateCart(customerId);
  if (cart.items.length === 0) {
    throw new AppError(MESSAGES.CART.EMPTY, 400);
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();
  if (!coupon) throw new AppError(MESSAGES.COUPON.NOT_FOUND, 404);

  // Validate coupon
  if (!coupon.isActive) throw new AppError(MESSAGES.COUPON.INVALID, 400);
  if (coupon.validFrom && new Date() < coupon.validFrom) throw new AppError(MESSAGES.COUPON.INVALID, 400);
  if (coupon.validUntil && new Date() > coupon.validUntil) throw new AppError(MESSAGES.COUPON.INVALID, 400);
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError(MESSAGES.COUPON.USAGE_LIMIT_REACHED, 400);
  }

  // Per-user limit check
  const userUsageCount = coupon.usedBy?.filter(
    (u) => u.customer.toString() === customerId.toString()
  ).length || 0;
  if (userUsageCount >= coupon.perUserLimit) {
    throw new AppError(MESSAGES.COUPON.ALREADY_USED, 400);
  }

  // Min order check
  const subtotal = cart.items.reduce((sum, item) => {
    const unitPrice = item.salePrice != null ? item.salePrice : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    throw new AppError(
      `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon.`,
      400
    );
  }

  // Apply
  cart.coupon = {
    code: coupon.code,
    couponId: coupon._id,
    discountType: coupon.type,
    discountValue: coupon.value,
    discountAmount: 0,
  };

  cart.recalculate();

  // Cap discount if maxDiscount is set
  if (coupon.maxDiscount && cart.coupon.discountAmount > coupon.maxDiscount) {
    cart.coupon.discountAmount = coupon.maxDiscount;
    cart.discount = coupon.maxDiscount;
    cart.total = Math.max(0, cart.subtotal - cart.discount + cart.tax);
  }

  await cart.save();
  return cartRepo.findByCustomer(customerId);
};

// ── Remove Coupon ─────────────────────────────────────────────────────────────

export const removeCoupon = async (customerId) => {
  const cart = await cartRepo.getOrCreateCart(customerId);
  cart.coupon = { code: null, couponId: null, discountType: null, discountValue: 0, discountAmount: 0 };
  cart.recalculate();
  await cart.save();
  return cartRepo.findByCustomer(customerId);
};
