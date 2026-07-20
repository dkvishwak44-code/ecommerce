import Product from "../product/product.model.js";
import { AppError } from "../../utils/AppError.js";
import { MESSAGES } from "../../constants/messages.js";
import * as cartRepository from "./cart.repository.js";

const isSameId = (left, right) => String(left) === String(right);

const getProductForCart = async (productId, variantId = null) => {
  const product = await Product.findById(productId);

  if (!product || !product.isPublished || product.status !== "active") {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
  }

  const variant = variantId
    ? product.variants.id(variantId)
    : null;

  if (variantId && !variant) {
    throw new AppError("Product variant not found.", 404);
  }

  const availableStock = variant ? variant.stock : product.stock;
  if (availableStock <= 0) {
    throw new AppError(MESSAGES.PRODUCT.OUT_OF_STOCK, 400);
  }

  const price = variant?.price ?? product.salePrice ?? product.price;
  const image = product.thumbnail?.url || product.images?.[0]?.url || null;

  return { product, variant, availableStock, price, image };
};

const normalizeCart = (cart) => {
  const obj = cart.toObject ? cart.toObject() : cart;
  return {
    ...obj,
    isEmpty: !obj.items?.length,
  };
};

export const getCart = async (customerId) => {
  const cart = await cartRepository.findOrCreateByCustomer(customerId);
  return normalizeCart(cart);
};

export const addToCart = async (customerId, { productId, quantity = 1, variantId = null }) => {
  const { product, variant, availableStock, price, image } = await getProductForCart(productId, variantId);
  const cart = await cartRepository.findOrCreateByCustomer(customerId);

  const existingItem = cart.items.find((item) => {
    const sameProduct = isSameId(item.product?._id || item.product, product._id);
    const sameVariant = variantId
      ? isSameId(item.variantId, variantId)
      : !item.variantId;

    return sameProduct && sameVariant;
  });

  const nextQuantity = (existingItem?.quantity || 0) + quantity;
  if (nextQuantity > availableStock) {
    throw new AppError(`Only ${availableStock} item(s) available in stock.`, 400);
  }

  if (existingItem) {
    existingItem.quantity = nextQuantity;
    existingItem.price = price;
  } else {
    cart.items.push({
      product: product._id,
      variantId: variant?._id || null,
      quantity,
      price,
      productSnapshot: {
        name: product.name,
        sku: product.sku || null,
        image,
        variant: variant ? `${variant.name}: ${variant.value}` : null,
        storeId: product.storeId || null,
      },
    });
  }

  const saved = await cartRepository.save(cart);
  return normalizeCart(await saved.populate("items.product"));
};

export const updateCartItem = async (customerId, itemId, { quantity }) => {
  const cart = await cartRepository.findOrCreateByCustomer(customerId);
  const item = cart.items.id(itemId);

  if (!item) {
    throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);
  }

  const { availableStock, price } = await getProductForCart(item.product?._id || item.product, item.variantId);

  if (quantity > availableStock) {
    throw new AppError(`Only ${availableStock} item(s) available in stock.`, 400);
  }

  item.quantity = quantity;
  item.price = price;

  const saved = await cartRepository.save(cart);
  return normalizeCart(await saved.populate("items.product"));
};

export const removeCartItem = async (customerId, itemId) => {
  const cart = await cartRepository.findOrCreateByCustomer(customerId);
  const item = cart.items.id(itemId);

  if (!item) {
    throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);
  }

  cart.items.pull(item._id);
  const saved = await cartRepository.save(cart);
  return normalizeCart(await saved.populate("items.product"));
};

export const clearCart = async (customerId) => {
  const cart = await cartRepository.findOrCreateByCustomer(customerId);
  cart.items = [];
  cart.coupon = { code: null, discount: 0 };

  const saved = await cartRepository.save(cart);
  return normalizeCart(saved);
};

export const applyCoupon = async (customerId, { code }) => {
  const cart = await cartRepository.findOrCreateByCustomer(customerId);

  if (!cart.items.length) {
    throw new AppError(MESSAGES.CART.EMPTY, 400);
  }

  cart.coupon = { code: code.toUpperCase(), discount: 0 };
  const saved = await cartRepository.save(cart);
  return normalizeCart(await saved.populate("items.product"));
};

export const removeCoupon = async (customerId) => {
  const cart = await cartRepository.findOrCreateByCustomer(customerId);
  cart.coupon = { code: null, discount: 0 };

  const saved = await cartRepository.save(cart);
  return normalizeCart(await saved.populate("items.product"));
};
