import * as orderRepository from "../order.repository.js";
import { AppError } from "../../../utils/AppError.js";
import { MESSAGES } from "../../../constants/messages.js";
import { CANCELLABLE_STATUSES, ORDER_STATUS } from "../../../constants/orderStatus.js";

export const getOrders = (customerId, query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100);
  return orderRepository.listByCustomer(customerId, { page, limit, status: query.status });
};

export const getOrder = async (customerId, orderId) => {
  const order = await orderRepository.findCustomerOrderById(customerId, orderId).lean();
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  return { order };
};

export const cancelOrder = async (customerId, orderId, { reason } = {}) => {
  const order = await orderRepository.findCustomerOrderById(customerId, orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    throw new AppError(MESSAGES.ORDER.CANNOT_CANCEL, 400);
  }

  order.status = ORDER_STATUS.CANCELLED;
  order.notes.cancellation = reason || null;
  order.statusHistory.push({ status: order.status, note: reason || "Cancelled by customer." });
  await order.save();
  return { order };
};

export const requestReturn = async (customerId, orderId, { reason }) => {
  const order = await orderRepository.findCustomerOrderById(customerId, orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);

  if (order.status !== ORDER_STATUS.DELIVERED) {
    throw new AppError(MESSAGES.ORDER.CANNOT_RETURN, 400);
  }

  order.status = ORDER_STATUS.RETURN_REQUESTED;
  order.notes.returnReason = reason;
  order.statusHistory.push({ status: order.status, note: reason });
  await order.save();
  return { order };
};

export const trackOrder = async (customerId, orderId) => {
  const { order } = await getOrder(customerId, orderId);
  return {
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.payment?.status,
    statusHistory: order.statusHistory,
  };
};
