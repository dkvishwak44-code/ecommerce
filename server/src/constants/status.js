/**
 * STATUS
 *
 * Shared status constants used across multiple modules.
 * Keeps status strings consistent everywhere — models, services, queries.
 *
 * Usage:
 *   import { STATUS, HTTP_STATUS } from "../constants/status.js";
 *   STATUS.ACTIVE          →  "active"
 *   HTTP_STATUS.NOT_FOUND  →  404
 */

// ── Record / Entity Status ───────────────────────────────────────────────────
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
  SUSPENDED: "suspended",
  BANNED: "banned",
  ARCHIVED: "archived",
  DRAFT: "draft",
  PUBLISHED: "published",
  REJECTED: "rejected",
  APPROVED: "approved",
};

export const ALL_STATUSES = Object.values(STATUS);

// ── HTTP Status Codes ─────────────────────────────────────────────────────────
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  NOT_MODIFIED: 304,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// ── Payment Status ────────────────────────────────────────────────────────────
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
  CANCELLED: "cancelled",
};

export const ALL_PAYMENT_STATUSES = Object.values(PAYMENT_STATUS);

// ── Review Status ─────────────────────────────────────────────────────────────
export const REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const ALL_REVIEW_STATUSES = Object.values(REVIEW_STATUS);

// ── Coupon Status ─────────────────────────────────────────────────────────────
export const COUPON_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "expired",
  EXHAUSTED: "exhausted", // usage limit reached
};

export const ALL_COUPON_STATUSES = Object.values(COUPON_STATUS);

// ── Notification Status ───────────────────────────────────────────────────────
export const NOTIFICATION_STATUS = {
  UNREAD: "unread",
  READ: "read",
};

// ── Store Verification Status ─────────────────────────────────────────────────
export const STORE_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

export const ALL_STORE_STATUSES = Object.values(STORE_STATUS);