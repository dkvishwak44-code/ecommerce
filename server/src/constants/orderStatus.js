/**
 * ORDER STATUS
 *
 * Defines every possible state in the order lifecycle.
 * Used across order model, controllers, jobs, sockets, and email templates.
 *
 * Usage:
 *   import { ORDER_STATUS } from "../constants/orderStatus.js";
 *   ORDER_STATUS.PENDING  →  "pending"
 */

export const ORDER_STATUS = {
  // ── Pre-fulfillment ────────────────────────────────────────────────────────
  PENDING: "pending",               // Order placed, awaiting payment confirmation
  PAYMENT_FAILED: "payment_failed", // Payment attempt failed
  CONFIRMED: "confirmed",           // Payment confirmed, ready for processing
  PROCESSING: "processing",         // Being picked/packed in warehouse

  // ── Fulfillment ────────────────────────────────────────────────────────────
  SHIPPED: "shipped",               // Handed over to courier, tracking available
  OUT_FOR_DELIVERY: "out_for_delivery", // Last-mile — with delivery agent
  DELIVERED: "delivered",           // Successfully delivered to customer

  // ── Post-fulfillment ───────────────────────────────────────────────────────
  RETURN_REQUESTED: "return_requested", // Customer raised a return request
  RETURN_APPROVED: "return_approved",   // Admin approved the return
  RETURN_REJECTED: "return_rejected",   // Admin rejected the return
  RETURNED: "returned",                 // Item physically returned to warehouse
  REFUND_INITIATED: "refund_initiated", // Refund triggered in payment gateway
  REFUNDED: "refunded",                 // Refund completed to customer

  // ── Cancellation ───────────────────────────────────────────────────────────
  CANCELLED: "cancelled",           // Cancelled by customer or admin
  EXPIRED: "expired",               // Never paid — auto-expired by job
};

/**
 * Flat array of all valid order status values.
 * Used in Mongoose enum validation.
 */
export const ALL_ORDER_STATUSES = Object.values(ORDER_STATUS);

/**
 * Statuses from which an order can still be cancelled.
 */
export const CANCELLABLE_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
];

/**
 * Statuses from which a return can be requested.
 */
export const RETURNABLE_STATUSES = [ORDER_STATUS.DELIVERED];

/**
 * Terminal statuses — no further transitions are allowed.
 */
export const TERMINAL_STATUSES = [
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.REFUNDED,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.EXPIRED,
  ORDER_STATUS.RETURN_REJECTED,
];

/**
 * Valid status transitions map.
 * Key = current status, Value = array of statuses it can move to.
 * Enforced in order.service.js before any status update.
 */
export const ORDER_STATUS_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PAYMENT_FAILED, ORDER_STATUS.CANCELLED, ORDER_STATUS.EXPIRED],
  [ORDER_STATUS.PAYMENT_FAILED]: [ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.OUT_FOR_DELIVERY],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURN_REQUESTED],
  [ORDER_STATUS.RETURN_REQUESTED]: [ORDER_STATUS.RETURN_APPROVED, ORDER_STATUS.RETURN_REJECTED],
  [ORDER_STATUS.RETURN_APPROVED]: [ORDER_STATUS.RETURNED],
  [ORDER_STATUS.RETURN_REJECTED]: [],
  [ORDER_STATUS.RETURNED]: [ORDER_STATUS.REFUND_INITIATED],
  [ORDER_STATUS.REFUND_INITIATED]: [ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.REFUNDED]: [],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.EXPIRED]: [],
};

/**
 * Returns true if transitioning from `current` to `next` is valid.
 *
 * @param {string} current
 * @param {string} next
 * @returns {boolean}
 */
export const isValidTransition = (current, next) => {
  const allowed = ORDER_STATUS_TRANSITIONS[current] ?? [];
  return allowed.includes(next);
};