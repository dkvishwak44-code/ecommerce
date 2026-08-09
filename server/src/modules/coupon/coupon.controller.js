/**
 * Coupon Controller
 * Client-facing: validate coupon before applying.
 */

import * as couponService from "./coupon.service.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const validateCoupon = asyncHandler(async (req, res) => {
  const result = await couponService.validateCoupon(req.customer._id, req.body);
  sendSuccess(res, {
    message: "Coupon is valid.",
    result,
  });
});
