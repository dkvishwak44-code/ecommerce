/**
 * Review Service
 * Business logic for customer review operations.
 */

import * as reviewRepo from "./review.repository.js";
import Review from "./review.model.js";
import Product from "../product/product.model.js";
import Order from "../order/order.model.js";
import { AppError } from "../../utils/AppError.js";
import { MESSAGES } from "../../constants/messages.js";
import { REVIEW_STATUS } from "../../constants/status.js";

/**
 * Get reviews for a product (only approved reviews shown to public).
 */
export const getProductReviews = async (productId, query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, parseInt(query.limit) || 10);

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { rating: -1 },
    lowest: { rating: 1 },
    helpful: { helpfulCount: -1 },
  };
  const sort = sortMap[query.sort] || { createdAt: -1 };

  const result = await reviewRepo.findByProduct(productId, { page, limit, sort });

  // Get rating distribution
  const ratingStats = await reviewRepo.getRatingStats(productId);

  return { ...result, ratingStats };
};

/**
 * Create a review. Auto-marks verified purchase if order exists.
 */
export const createReview = async (customerId, data) => {
  const { productId, rating, title, comment } = data;

  // Check product exists
  const product = await Product.findById(productId).lean();
  if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

  // Check for duplicate review
  const existing = await reviewRepo.findByCustomerAndProduct(customerId, productId);
  if (existing) throw new AppError(MESSAGES.REVIEW.ALREADY_REVIEWED, 409);

  // Check if customer purchased this product
  let isVerifiedPurchase = false;
  const order = await Order.findOne({
    customer: customerId,
    "items.product": productId,
    status: { $in: ["delivered", "completed"] },
  }).lean();

  if (order) {
    isVerifiedPurchase = true;
  }

  const review = await reviewRepo.create({
    customer: customerId,
    product: productId,
    order: order?._id || null,
    rating,
    title,
    comment,
    isVerifiedPurchase,
    status: REVIEW_STATUS.PENDING,
  });

  // Recalculate product rating (includes pending in some setups, but we use approved only)
  // This will be effective once admin approves
  await Review.recalculateProductRating(productId);

  return review;
};

/**
 * Update own review.
 */
export const updateReview = async (customerId, reviewId, data) => {
  const review = await reviewRepo.findById(reviewId);
  if (!review) throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);
  if (review.customer.toString() !== customerId.toString()) {
    throw new AppError("You can only edit your own reviews.", 403);
  }

  const { rating, title, comment } = data;
  const updateData = {};
  if (rating !== undefined) updateData.rating = rating;
  if (title !== undefined) updateData.title = title;
  if (comment !== undefined) updateData.comment = comment;
  updateData.status = REVIEW_STATUS.PENDING; // re-moderate on edit

  const updated = await reviewRepo.updateById(reviewId, updateData);
  await Review.recalculateProductRating(review.product);

  return updated;
};

/**
 * Delete own review (soft delete).
 */
export const deleteReview = async (customerId, reviewId) => {
  const review = await reviewRepo.findById(reviewId);
  if (!review) throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);
  if (review.customer.toString() !== customerId.toString()) {
    throw new AppError("You can only delete your own reviews.", 403);
  }

  await reviewRepo.softDelete(reviewId);
  await Review.recalculateProductRating(review.product);
};
