/**
 * Client Checkout Controller
 * Handles the checkout flow endpoints.
 */

import * as checkoutService from "./checkout.service.js";
import { sendSuccess } from "../../../utils/response.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { HTTP_STATUS } from "../../../constants/status.js";

export const getCheckoutSummary = asyncHandler(async (req, res) => {
  const result = await checkoutService.getCheckoutSummary(req.customer._id);
  sendSuccess(res, {
    message: "Checkout summary fetched.",
    result,
  });
});

export const initiateCheckout = asyncHandler(async (req, res) => {
  const result = await checkoutService.initiateCheckout(req.customer._id, req.body);
  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: result.message,
    result,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await checkoutService.verifyPayment(req.customer._id, req.body);
  sendSuccess(res, {
    message: "Payment verified successfully.",
    result,
  });
});

export const getOrderConfirmation = asyncHandler(async (req, res) => {
  const result = await checkoutService.getOrderConfirmation(
    req.customer._id,
    req.params.orderId
  );
  sendSuccess(res, {
    message: "Order confirmation fetched.",
    result,
  });
});
