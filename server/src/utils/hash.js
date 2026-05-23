// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
/** Default bcrypt salt rounds */
const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt.
 *
 * @param {string} password - Plain text password
 * @param {number} [rounds=SALT_ROUNDS] - Salt rounds (cost factor)
 * @returns {Promise<string>} Bcrypt hash
 */
const hashPassword = async (password, rounds = SALT_ROUNDS) => {
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain-text password against a bcrypt hash.
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Stored bcrypt hash
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Create a SHA-256 HMAC of a value using the app secret.
 * Useful for signing tokens or creating verification hashes.
 *
 * @param {string} value - Value to sign
 * @param {string} [secret=process.env.JWT_SECRET] - HMAC secret
 * @returns {string} Hex digest
 */
const createHmac = (value, secret = process.env.JWT_SECRET) => {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
};

/**
 * Create a SHA-256 hash of a value (no secret, for token storage).
 *
 * @param {string} value
 * @returns {string} Hex digest
 */
const sha256 = (value) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

/**
 * Timing-safe string comparison to prevent timing attacks.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
const safeCompare = (a, b) => {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
};

export {
  hashPassword,
  comparePassword,
  createHmac,
  sha256,
  safeCompare,
  SALT_ROUNDS,
};