// const mongoose = require('mongoose');
import mongoose from 'mongoose';

// ── String validators ──────────────────────────────────────────────────────────

/**
 * Check if a value is a non-empty string.
 * @param {*} value
 * @returns {boolean}
 */
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

/**
 * Validate an email address.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(String(email).toLowerCase());
};

/**
 * Validate an Indian mobile number (10 digits, optionally prefixed with +91 or 0).
 * @param {string} phone
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
  const PHONE_REGEX = /^(?:\+91|0)?[6-9]\d{9}$/;
  return PHONE_REGEX.test(String(phone).replace(/\s+/g, ''));
};

/**
 * Validate an international phone number (E.164 format).
 * @param {string} phone
 * @returns {boolean}
 */
const isValidInternationalPhone = (phone) => {
  const E164_REGEX = /^\+[1-9]\d{6,14}$/;
  return E164_REGEX.test(phone);
};

/**
 * Validate a strong password:
 *   - At least 8 characters
 *   - Contains uppercase, lowercase, digit, and special character
 * @param {string} password
 * @returns {boolean}
 */
const isStrongPassword = (password) => {
  const STRONG_PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return STRONG_PASS_REGEX.test(password);
};

/**
 * Validate a URL string.
 * @param {string} url
 * @returns {boolean}
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate a slug (lowercase alphanumeric with hyphens).
 * @param {string} slug
 * @returns {boolean}
 */
const isValidSlug = (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

// ── Number validators ──────────────────────────────────────────────────────────

/**
 * Check whether a value is a positive number (> 0).
 * @param {*} value
 * @returns {boolean}
 */
const isPositiveNumber = (value) => typeof value === 'number' && isFinite(value) && value > 0;

/**
 * Check whether a value is a non-negative number (>= 0).
 * @param {*} value
 * @returns {boolean}
 */
const isNonNegativeNumber = (value) => typeof value === 'number' && isFinite(value) && value >= 0;

/**
 * Validate a price value (finite number >= 0).
 * @param {*} value
 * @returns {boolean}
 */
const isValidPrice = (value) => isNonNegativeNumber(Number(value));

/**
 * Validate a percentage value (0 – 100 inclusive).
 * @param {*} value
 * @returns {boolean}
 */
const isValidPercentage = (value) => {
  const num = Number(value);
  return isFinite(num) && num >= 0 && num <= 100;
};

// ── Mongo validators ───────────────────────────────────────────────────────────

/**
 * Validate a MongoDB ObjectId string.
 * @param {*} id
 * @returns {boolean}
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Validate an array of MongoDB ObjectId strings.
 * @param {*[]} ids
 * @returns {boolean}
 */
const areValidObjectIds = (ids) => Array.isArray(ids) && ids.every(isValidObjectId);

// ── Date validators ────────────────────────────────────────────────────────────

/**
 * Validate that a value is a parseable date.
 * @param {*} value
 * @returns {boolean}
 */
const isValidDate = (value) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

/**
 * Validate that end date is after start date.
 * @param {Date|string} start
 * @param {Date|string} end
 * @returns {boolean}
 */
const isEndAfterStart = (start, end) => {
  return isValidDate(start) && isValidDate(end) && new Date(end) > new Date(start);
};

// ── Indian-specific validators ─────────────────────────────────────────────────

/**
 * Validate an Indian GST number.
 * Format: 2 digits (state) + 10 PAN chars + 1Z + 1 checksum = 15 chars
 * @param {string} gst
 * @returns {boolean}
 */
const isValidGST = (gst) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);

/**
 * Validate an Indian PAN number.
 * Format: 5 uppercase letters + 4 digits + 1 uppercase letter
 * @param {string} pan
 * @returns {boolean}
 */
const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

/**
 * Validate an Indian PIN code (6 digits).
 * @param {string|number} pin
 * @returns {boolean}
 */
const isValidPinCode = (pin) => /^[1-9][0-9]{5}$/.test(String(pin));

// ── Misc ───────────────────────────────────────────────────────────────────────

/**
 * Validate a hex colour code (#RGB or #RRGGBB).
 * @param {string} color
 * @returns {boolean}
 */
const isValidHexColor = (color) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

/**
 * Check whether a value is a plain object (not Array, Date, etc.).
 * @param {*} value
 * @returns {boolean}
 */
const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;

export default {
  isNonEmptyString,
  isValidEmail,
  isValidPhone,
  isValidInternationalPhone,
  isStrongPassword,
  isValidUrl,
  isValidSlug,
  isPositiveNumber,
  isNonNegativeNumber,
  isValidPrice,
  isValidPercentage,
  isValidObjectId,
  areValidObjectIds,
  isValidDate,
  isEndAfterStart,
  isValidGST,
  isValidPAN,
  isValidPinCode,
  isValidHexColor,
  isPlainObject,
};