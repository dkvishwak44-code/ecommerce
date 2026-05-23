// const path = require('path');
import dotenv from "dotenv";
import path from 'path';
// require('dotenv').config({ path: path.join(process.cwd(), '.env') });
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

/**
 * Validate that all required environment variables are set.
 * Throws an error on startup if any are missing.
 */
const requiredEnvVars = [
  // App
  'NODE_ENV',
  'PORT',
  'APP_NAME',
  'CLIENT_URL',

  // Database
  'MONGODB_URI',

  // JWT
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRES_IN',

  // Redis
  'REDIS_HOST',
  'REDIS_PORT',

  // Cloudinary
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',

  // Mail
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASS',
  'MAIL_FROM',
  'MAIL_FROM_NAME',
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables:\n  ${missingVars.join('\n  ')}`
  );
}

export const env = {
  // ── App ──────────────────────────────────────────────────────────────────────
  NODE_ENV:    process.env.NODE_ENV || 'development',
  PORT:        parseInt(process.env.PORT, 10) || 5000,
  APP_NAME:    process.env.APP_NAME || 'App',
  CLIENT_URL:  process.env.CLIENT_URL,
  API_VERSION: process.env.API_VERSION || 'v1',

  isDev:        process.env.NODE_ENV === 'development',
  isProd:       process.env.NODE_ENV === 'production',
  isTest:       process.env.NODE_ENV === 'test',

  // ── Database ─────────────────────────────────────────────────────────────────
  MONGODB_URI: process.env.MONGODB_URI,

  // ── JWT ───────────────────────────────────────────────────────────────────────
  JWT_SECRET:              process.env.JWT_SECRET,
  JWT_EXPIRES_IN:          process.env.JWT_EXPIRES_IN          || '7d',
  JWT_REFRESH_SECRET:      process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN:  process.env.JWT_REFRESH_EXPIRES_IN  || '30d',

  // ── Redis ─────────────────────────────────────────────────────────────────────
  REDIS_HOST:     process.env.REDIS_HOST     || '127.0.0.1',
  REDIS_PORT:     parseInt(process.env.REDIS_PORT, 10) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || null,
  REDIS_DB:       parseInt(process.env.REDIS_DB, 10)   || 0,

  // ── Cloudinary ────────────────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY:    process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // ── Mail ──────────────────────────────────────────────────────────────────────
  MAIL_HOST:      process.env.MAIL_HOST,
  MAIL_PORT:      parseInt(process.env.MAIL_PORT, 10) || 587,
  MAIL_SECURE:    process.env.MAIL_SECURE === 'true',
  MAIL_USER:      process.env.MAIL_USER,
  MAIL_PASS:      process.env.MAIL_PASS,
  MAIL_FROM:      process.env.MAIL_FROM,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || process.env.APP_NAME || 'App',

  // ── Rate Limiting ─────────────────────────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX:       parseInt(process.env.RATE_LIMIT_MAX, 10)       || 100,

  // ── OTP ───────────────────────────────────────────────────────────────────────
  OTP_EXPIRES_MINUTES: parseInt(process.env.OTP_EXPIRES_MINUTES, 10) || 10,
  OTP_LENGTH:          parseInt(process.env.OTP_LENGTH, 10)          || 6,

  // ── File Upload ───────────────────────────────────────────────────────────────
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5,

  // ── Super Admin (bootstrap) ───────────────────────────────────────────────────
  SUPER_ADMIN_EMAIL:    process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,

  // ── Socket ────────────────────────────────────────────────────────────────────
  SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN || process.env.CLIENT_URL,
};

// export default env;