// const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger.js";
// const logger = require('./logger');
// import {logger} from './logger';

/**
 * Configure Cloudinary with credentials from environment variables.
 * Called once on app startup.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS URLs
});

/**
 * Verify Cloudinary connection on startup.
 * Logs a warning if credentials are missing or invalid.
 */
const verifyCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    logger.info('Cloudinary connected successfully');
  } catch (err) {
    logger.warn('Cloudinary connection failed:', err.message);
  }
};
 
export {cloudinary, verifyCloudinaryConnection };