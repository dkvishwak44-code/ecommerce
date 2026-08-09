/**
 * Coupon Repository
 * All direct DB queries for the Coupon model.
 */

import Coupon from "./coupon.model.js";

export const findByCode = (code) =>
  Coupon.findOne({ code: code.toUpperCase() }).lean();

export const findById = (id) =>
  Coupon.findById(id).lean();

export const incrementUsage = async (couponId, customerId, orderId = null) =>
  Coupon.findByIdAndUpdate(
    couponId,
    {
      $inc: { usedCount: 1 },
      $push: {
        usedBy: {
          customer: customerId,
          usedAt: new Date(),
          orderId,
        },
      },
    },
    { new: true }
  );

export const findAll = async ({ filter = {}, sort = { createdAt: -1 }, page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Coupon.countDocuments(filter),
  ]);
  return { coupons, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const create = (data) =>
  Coupon.create(data);

export const updateById = (id, data) =>
  Coupon.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();

export const deleteById = (id) =>
  Coupon.findByIdAndDelete(id);
