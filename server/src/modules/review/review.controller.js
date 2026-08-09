/**
 * Review Controller
 * Thin layer — calls service, sends response.
 */

import * as reviewService from "./review.service.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { MESSAGES } from "../../constants/messages.js";
import { HTTP_STATUS } from "../../constants/status.js";

export const getProductReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getProductReviews(
    req.params.productId,
    req.query
  );
  sendSuccess(res, {
    message: MESSAGES.REVIEW.LIST_FETCHED,
    result,
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.customer._id, req.body);
  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: MESSAGES.REVIEW.CREATED,
    result: { review },
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.customer._id,
    req.params.id,
    req.body
  );
  sendSuccess(res, {
    message: MESSAGES.REVIEW.UPDATED,
    result: { review },
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.customer._id, req.params.id);
  sendSuccess(res, {
    message: MESSAGES.REVIEW.DELETED,
  });
});
