/**
 * Coupon Service
 * Business logic for coupon validation (client-facing).
 */

import * as couponRepo from "./coupon.repository.js";
import { AppError } from "../../utils/AppError.js";
import { MESSAGES } from "../../constants/messages.js";

/**
 * Validate a coupon code for the customer.
 * Does NOT apply it — just checks validity and returns discount info.
 * Actual application happens via cart.service.applyCoupon.
 */
export const validateCoupon = async (customerId, { code, cartTotal = 0 }) => {
  const coupon = await couponRepo.findByCode(code);
  if (!coupon) throw new AppError(MESSAGES.COUPON.NOT_FOUND, 404);

  // Active check
  if (!coupon.isActive) throw new AppError(MESSAGES.COUPON.INVALID, 400);

  // Date validity
  const now = new Date();
  if (coupon.validFrom && now < new Date(coupon.validFrom)) {
    throw new AppError(MESSAGES.COUPON.INVALID, 400);
  }
  if (coupon.validUntil && now > new Date(coupon.validUntil)) {
    throw new AppError(MESSAGES.COUPON.INVALID, 400);
  }

  // Usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError(MESSAGES.COUPON.USAGE_LIMIT_REACHED, 400);
  }

  // Per-user limit
  const userUsageCount = coupon.usedBy?.filter(
    (u) => u.customer.toString() === customerId.toString()
  ).length || 0;
  if (userUsageCount >= coupon.perUserLimit) {
    throw new AppError(MESSAGES.COUPON.ALREADY_USED, 400);
  }

  // Min order amount
  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    throw new AppError(
      `Minimum order amount of ₹${coupon.minOrderAmount} required.`,
      400
    );
  }

  // Calculate potential discount
  let discountAmount = 0;
  if (cartTotal > 0) {
    if (coupon.type === "percentage") {
      discountAmount = Math.round((cartTotal * coupon.value) / 100);
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = Math.min(coupon.value, cartTotal);
    }
  }

  return {
    valid: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount,
      minOrderAmount: coupon.minOrderAmount,
      description: coupon.description,
      discountAmount,
    },
  };
};
