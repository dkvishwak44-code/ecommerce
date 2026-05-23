// const crypto = require('crypto');
import crypto from "crypto"

/**
 * Generate a numeric OTP of the specified length.
 *
 * @param {number} [length=6] - Number of digits
 * @returns {string} Zero-padded numeric OTP string
 */
const generateOtp = (length = 6) => {
  const max = Math.pow(10, length);
  // Use crypto for cryptographically secure random numbers
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0) % max;
  return String(randomNumber).padStart(length, '0');
};

/**
 * Generate an OTP expiry date.
 *
 * @param {number} [minutes=10] - Minutes until expiry
 * @returns {Date}
 */
const generateOtpExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Check whether an OTP has expired.
 *
 * @param {Date|string} expiresAt - Expiry timestamp stored in DB
 * @returns {boolean} true if expired
 */
const isOtpExpired = (expiresAt) => {
  return new Date(expiresAt) < new Date();
};

/**
 * Generate a secure alphanumeric token (for email verification, password reset, etc.).
 *
 * @param {number} [byteLength=32] - Number of random bytes (token length = byteLength * 2 hex chars)
 * @returns {string} Hex token string
 */
const generateSecureToken = (byteLength = 32) => {
  return crypto.randomBytes(byteLength).toString('hex');
};

/**
 * Hash a token for secure storage (store hash in DB, send raw to user).
 *
 * @param {string} token - Raw token
 * @returns {string} SHA-256 hex digest
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export {
  generateOtp,
  generateOtpExpiry,
  isOtpExpired,
  generateSecureToken,
  hashToken,
};