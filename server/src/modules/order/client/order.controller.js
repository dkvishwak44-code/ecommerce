import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";
import { HTTP_STATUS } from "../../../constants/status.js";
import { MESSAGES } from "../../../constants/messages.js";
import * as orderService from "./order.service.js";

const getCustomerId = (req) => req.customer?._id || req.user?.id;

export const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getOrders(getCustomerId(req), req.query);
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: MESSAGES.ORDER.LIST_FETCHED, result });
});

export const getOrder = asyncHandler(async (req, res) => {
  const result = await orderService.getOrder(getCustomerId(req), req.params.id);
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: MESSAGES.ORDER.FETCHED, result });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const result = await orderService.cancelOrder(getCustomerId(req), req.params.id, req.body);
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: MESSAGES.ORDER.CANCELLED, result });
});

export const requestReturn = asyncHandler(async (req, res) => {
  const result = await orderService.requestReturn(getCustomerId(req), req.params.id, req.body);
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: MESSAGES.ORDER.RETURN_REQUESTED, result });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const result = await orderService.trackOrder(getCustomerId(req), req.params.id);
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: "Order tracking fetched successfully.", result });
});

export const downloadInvoice = asyncHandler(async (req, res) => {
  const result = await orderService.getOrder(getCustomerId(req), req.params.id);
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: MESSAGES.ORDER.INVOICE_GENERATED, result });
});
