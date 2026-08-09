/**
 * Client Order Service
 * Customer viewing and managing their own orders.
 */

import * as orderRepo from "../order.repository.js";
import * as customerRepo from "../../customer/customer.repository.js";
import Product from "../../product/product.model.js";
import { ORDER_STATUS } from "../order.model.js";
import { AppError } from "../../../utils/AppError.js";
import { MESSAGES } from "../../../constants/messages.js";

/**
 * Get paginated order history for the customer.
 */
export const getOrders = async (customerId, query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, parseInt(query.limit) || 10);

  return orderRepo.findByCustomer(customerId, {
    page,
    limit,
    status: query.status || undefined,
  });
};

/**
 * Get single order detail.
 */
export const getOrder = async (customerId, orderId) => {
  const order = await orderRepo.findById(orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  if (order.customer._id?.toString() !== customerId.toString() &&
      order.customer.toString() !== customerId.toString()) {
    throw new AppError(MESSAGES.GENERIC.FORBIDDEN, 403);
  }
  return { order };
};

/**
 * Cancel an order (only if pending or confirmed).
 */
export const cancelOrder = async (customerId, orderId, { reason } = {}) => {
  const order = await orderRepo.findByIdRaw(orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  if (order.customer.toString() !== customerId.toString()) {
    throw new AppError(MESSAGES.GENERIC.FORBIDDEN, 403);
  }

  const cancellableStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING];
  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError(MESSAGES.ORDER.CANNOT_CANCEL, 400);
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, totalSales: -item.quantity },
    });
  }

  order.status = ORDER_STATUS.CANCELLED;
  order.cancelReason = reason || null;
  order.cancelledAt = new Date();
  await order.save();

  return { order };
};

/**
 * Request return (only if delivered).
 */
export const requestReturn = async (customerId, orderId, { reason }) => {
  const order = await orderRepo.findByIdRaw(orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  if (order.customer.toString() !== customerId.toString()) {
    throw new AppError(MESSAGES.GENERIC.FORBIDDEN, 403);
  }

  if (order.status !== ORDER_STATUS.DELIVERED) {
    throw new AppError(MESSAGES.ORDER.CANNOT_RETURN, 400);
  }

  // Check return window (7 days)
  const deliveredAt = order.deliveredAt || order.updatedAt;
  const daysSinceDelivery = (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceDelivery > 7) {
    throw new AppError("Return window has expired (7 days from delivery).", 400);
  }

  order.status = ORDER_STATUS.RETURN_REQUESTED;
  order.returnReason = reason;
  order.returnRequestedAt = new Date();
  await order.save();

  // Increment return count
  await customerRepo.incrementReturnCount(customerId);

  return { order };
};

/**
 * Download invoice — returns order data for PDF generation.
 */
export const downloadInvoice = async (customerId, orderId) => {
  const order = await orderRepo.findById(orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  if (order.customer._id?.toString() !== customerId.toString() &&
      order.customer.toString() !== customerId.toString()) {
    throw new AppError(MESSAGES.GENERIC.FORBIDDEN, 403);
  }

  return { order };
};

/**
 * Track order — status timeline.
 */
export const trackOrder = async (customerId, orderId) => {
  const order = await orderRepo.findById(orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  if (order.customer._id?.toString() !== customerId.toString() &&
      order.customer.toString() !== customerId.toString()) {
    throw new AppError(MESSAGES.GENERIC.FORBIDDEN, 403);
  }

  return {
    orderNumber: order.orderNumber,
    currentStatus: order.status,
    statusHistory: order.statusHistory,
    trackingNumber: order.trackingNumber,
    shippingProvider: order.shippingProvider,
    estimatedDelivery: order.estimatedDelivery,
    deliveredAt: order.deliveredAt,
  };
};
