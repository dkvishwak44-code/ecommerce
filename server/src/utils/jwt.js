import jwt from 'jsonwebtoken';

// const {
//   JWT_SECRET,
//   JWT_EXPIRES_IN = '7d',
//   JWT_REFRESH_SECRET,
//   JWT_REFRESH_EXPIRES_IN = '30d',
// } = process.env;
import { env } from '../config/env.js'
const { JWT_SECRET,JWT_EXPIRES_IN,JWT_REFRESH_SECRET,JWT_REFRESH_EXPIRES_IN } = env;

/**
 * Generate an access token.
 * Alias for signAccessToken — used by auth.service.js and auth.middleware.js.
 *
 * @param {object} payload     - Data to embed (e.g. { id, role, scope })
 * @param {string} [expiresIn] - Override default expiry (e.g. "15m")
 * @returns {string} Signed JWT
 */
const generateAccessToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Generate a refresh token.
 * Alias for signRefreshToken — used by auth.service.js.
 *
 * @param {object} payload
 * @returns {string} Signed JWT
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    { id: payload.id },
    JWT_REFRESH_SECRET || JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

/**
 * Sign an access token.
 *
 * @param {object} payload
 * @param {object} [options] - jsonwebtoken sign options (override defaults)
 * @returns {string} Signed JWT
 */
const signAccessToken = (payload, options = {}) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  });
};

/**
 * Sign a refresh token.
 *
 * @param {object} payload
 * @param {object} [options]
 * @returns {string} Signed JWT
 */
const signRefreshToken = (payload, options = {}) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET || JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    ...options,
  });
};

/**
 * Verify and decode an access token.
 * Throws on failure — caught by auth middleware.
 *
 * @param {string} token
 * @returns {object} Decoded payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Verify and decode a refresh token.
 * Throws on failure — caught by auth.service.js.
 *
 * @param {string} token
 * @returns {object} Decoded payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET || JWT_SECRET);
};

/**
 * Decode a token WITHOUT verifying signature.
 * Useful for reading expired tokens.
 *
 * @param {string} token
 * @returns {object|null}
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate both access and refresh tokens for a user/customer.
 *
 * @param {object} payload - e.g. { id, role, store }
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokenPair = (payload) => {
  const accessToken  = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

/**
 * Extract the raw token string from an Authorization header.
 * Expects "Bearer <token>" format.
 *
 * @param {string} authHeader - req.headers.authorization
 * @returns {string|null}
 */
const extractBearerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1] || null;
};

export {
  generateAccessToken,  // ← added
  generateRefreshToken, // ← added
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  generateTokenPair,
  extractBearerToken,
};