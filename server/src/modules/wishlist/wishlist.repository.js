/**
 * Wishlist Repository
 * All direct DB queries for the Wishlist model.
 */

import Wishlist from "./wishlist.model.js";

export const findByCustomer = (customerId) =>
  Wishlist.findOne({ customer: customerId })
    .populate("items.product", "name slug price salePrice thumbnail images stock status isPublished")
    .lean();

export const getOrCreateWishlist = async (customerId) => {
  let wishlist = await Wishlist.findOne({ customer: customerId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ customer: customerId, items: [] });
  }
  return wishlist;
};

export const addProduct = async (customerId, productId) =>
  Wishlist.findOneAndUpdate(
    { customer: customerId },
    { $addToSet: { items: { product: productId } } },
    { new: true, upsert: true }
  ).populate("items.product", "name slug price salePrice thumbnail images stock status isPublished");

export const removeProduct = async (customerId, productId) =>
  Wishlist.findOneAndUpdate(
    { customer: customerId },
    { $pull: { items: { product: productId } } },
    { new: true }
  ).populate("items.product", "name slug price salePrice thumbnail images stock status isPublished");

export const clearWishlist = async (customerId) =>
  Wishlist.findOneAndUpdate(
    { customer: customerId },
    { $set: { items: [] } },
    { new: true }
  );
