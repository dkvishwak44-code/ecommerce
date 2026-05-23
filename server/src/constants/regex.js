/**
 * REGEX
 *
 * Shared regular expressions used across validation schemas and utilities.
 *
 * Usage:
 *   import { REGEX } from "../constants/regex.js";
 *   REGEX.EMAIL.test("user@example.com")  →  true
 */

export const REGEX = {
  // ── Identity ───────────────────────────────────────────────────────────────
  EMAIL: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,

  // Minimum 8 chars, at least one uppercase, one lowercase, one digit, one special char
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#\-_])[A-Za-z\d@$!%*?&^#\-_]{8,}$/,

  // E.164 format — e.g. +919876543210
  PHONE: /^\+?[1-9]\d{6,14}$/,

  // Indian mobile number (10 digits, starts with 6-9)
  PHONE_IN: /^[6-9]\d{9}$/,

  // OTP: 4–6 digit numeric string
  OTP: /^\d{4,6}$/,

  // ── Naming ────────────────────────────────────────────────────────────────
  // Only letters, spaces, hyphens, apostrophes (for person names / city names)
  NAME: /^[a-zA-Z\s'\-]{2,60}$/,

  // Alphanumeric with spaces, hyphens, ampersands (for store/brand/product names)
  DISPLAY_NAME: /^[a-zA-Z0-9\s\-&',.]{2,100}$/,

  // URL-friendly slug: lowercase letters, digits, hyphens only
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  // ── Financial ─────────────────────────────────────────────────────────────
  // Coupon code: uppercase letters and digits, 3–20 chars
  COUPON_CODE: /^[A-Z0-9]{3,20}$/,

  // Positive decimal number (e.g. price, tax rate)
  POSITIVE_DECIMAL: /^\d+(\.\d{1,2})?$/,

  // ISO 4217 currency code: 3 uppercase letters
  CURRENCY_CODE: /^[A-Z]{3}$/,

  // ── Location ──────────────────────────────────────────────────────────────
  // Indian PIN code (6 digits)
  PIN_CODE_IN: /^\d{6}$/,

  // Generic postal code: 3–10 alphanumeric chars with optional spaces/hyphens
  POSTAL_CODE: /^[a-zA-Z0-9\s\-]{3,10}$/,

  // ── Web ───────────────────────────────────────────────────────────────────
  // Basic URL (http/https)
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,

  // HEX color code: #FFF or #FFFFFF
  HEX_COLOR: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/,

  // ── IDs ───────────────────────────────────────────────────────────────────
  // MongoDB ObjectId: 24 hex characters
  MONGO_ID: /^[a-f\d]{24}$/i,

  // UUID v4
  UUID_V4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};