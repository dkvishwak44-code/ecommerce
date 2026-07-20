import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";
import { HTTP_STATUS } from "../../../constants/status.js";
import * as checkoutService from "./checkout.service.js";

const getCustomerId = (req) => req.customer?._id || req.user?.id;

export const getCheckoutSummary = asyncHandler(async (req, res) => {
  const result = await checkoutService.getCheckoutSummary(getCustomerId(req));
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: "Checkout summary fetched successfully.", result });
});

export const initiateCheckout = asyncHandler(async (req, res) => {
  const result = await checkoutService.initiateCheckout(getCustomerId(req), req.body);
  return sendSuccess(res, { statusCode: HTTP_STATUS.CREATED, message: "Checkout initiated successfully.", result });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await checkoutService.verifyPayment(getCustomerId(req), req.body);
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: "Payment verified successfully.", result });
});

export const getOrderConfirmation = asyncHandler(async (req, res) => {
  const result = await checkoutService.getOrderConfirmation(getCustomerId(req), req.params.orderId);
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: "Order confirmation fetched successfully.", result });
});
