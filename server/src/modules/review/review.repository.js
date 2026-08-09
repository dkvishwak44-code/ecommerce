/**
 * Review Repository
 * All direct DB queries for the Review model.
 */

import Review from "./review.model.js";
import { REVIEW_STATUS } from "../../constants/status.js";

export const findByProduct = async (productId, { page = 1, limit = 10, sort = { createdAt: -1 } } = {}) => {
  const skip = (page - 1) * limit;
  const filter = {
    product: productId,
    status: REVIEW_STATUS.APPROVED,
  };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("customer", "name avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findByCustomerAndProduct = (customerId, productId) =>
  Review.findOne({ customer: customerId, product: productId });

export const findById = (id) =>
  Review.findById(id);

export const create = (data) =>
  Review.create(data);

export const updateById = (id, data) =>
  Review.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });

export const softDelete = async (id) => {
  return Review.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
};

export const getRatingStats = async (productId) => {
  return Review.aggregate([
    {
      $match: {
        product: productId,
        status: REVIEW_STATUS.APPROVED,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);
};
