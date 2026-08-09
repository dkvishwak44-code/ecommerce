/**
 * Cart Repository
 * All direct DB queries for the Cart model.
 */

import Cart from "./cart.model.js";

export const findByCustomer = (customerId) =>
  Cart.findOne({ customer: customerId })
    .populate("items.product", "name slug price salePrice stock thumbnail images status isPublished")
    .lean();

export const findByCustomerRaw = (customerId) =>
  Cart.findOne({ customer: customerId });

export const getOrCreateCart = async (customerId) => {
  let cart = await Cart.findOne({ customer: customerId });
  if (!cart) {
    cart = await Cart.create({ customer: customerId, items: [] });
  }
  return cart;
};

export const updateCart = (cartId, data) =>
  Cart.findByIdAndUpdate(cartId, data, { new: true }).lean();

export const deleteCart = (customerId) =>
  Cart.findOneAndDelete({ customer: customerId });
