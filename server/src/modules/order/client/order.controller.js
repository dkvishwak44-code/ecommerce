/**
 * Client Order Controller
 * Customer viewing and managing their own orders.
 */

import * as orderService from "./order.service.js";
import { sendSuccess } from "../../../utils/response.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { MESSAGES } from "../../../constants/messages.js";

export const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getOrders(req.customer._id, req.query);
  sendSuccess(res, {
    message: MESSAGES.ORDER.LIST_FETCHED,
    result,
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const result = await orderService.getOrder(req.customer._id, req.params.id);
  sendSuccess(res, {
    message: MESSAGES.ORDER.FETCHED,
    result,
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const result = await orderService.cancelOrder(
    req.customer._id,
    req.params.id,
    req.body
  );
  sendSuccess(res, {
    message: MESSAGES.ORDER.CANCELLED,
    result,
  });
});

export const requestReturn = asyncHandler(async (req, res) => {
  const result = await orderService.requestReturn(
    req.customer._id,
    req.params.id,
    req.body
  );
  sendSuccess(res, {
    message: MESSAGES.ORDER.RETURN_REQUESTED,
    result,
  });
});

export const downloadInvoice = asyncHandler(async (req, res) => {
  const result = await orderService.downloadInvoice(
    req.customer._id,
    req.params.id
  );
  // In production, generate PDF using invoiceGenerator utility
  sendSuccess(res, {
    message: MESSAGES.ORDER.INVOICE_GENERATED,
    result,
  });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const result = await orderService.trackOrder(
    req.customer._id,
    req.params.id
  );
  sendSuccess(res, {
    message: MESSAGES.ORDER.FETCHED,
    result,
  });
});
