// const cloudinary = require('../config/cloudinary');
// const fs = require('fs');
// const path = require('path');
// const logger = require('../config/logger');
// import {cloudinary }from '../config/cloudinary';
import {cloudinary}  from "../config/cloudinary.js"
import fs from 'fs';
import path from 'path';
import { logger } from "../config/logger.js";
// import {logger} from '../config/logger';  

/**
 * Upload a file to Cloudinary from a local temp path.
 *
 * @param {string} filePath      - Absolute path to the temp file
 * @param {object} [options]
 * @param {string}  [options.folder='uploads']       - Cloudinary folder
 * @param {string}  [options.resourceType='auto']    - 'image', 'video', 'raw', or 'auto'
 * @param {number}  [options.width]                  - Resize width
 * @param {number}  [options.height]                 - Resize height
 * @param {string}  [options.crop='limit']           - Cloudinary crop mode
 * @param {boolean} [options.deleteLocal=true]       - Remove temp file after upload
 * @returns {Promise<{ url: string, publicId: string, format: string, bytes: number }>}
 */
const uploadToCloudinary = async (
  filePath,
  {
    folder = 'uploads',
    resourceType = 'auto',
    width,
    height,
    crop = 'limit',
    deleteLocal = true,
  } = {}
) => {
  try {
    const transformation = [];
    if (width || height) {
      transformation.push({ width, height, crop });
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
      ...(transformation.length > 0 && { transformation }),
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  } finally {
    if (deleteLocal && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

/**
 * Upload multiple files to Cloudinary concurrently.
 *
 * @param {string[]} filePaths - Array of absolute temp file paths
 * @param {object}   [options] - Same options as uploadToCloudinary
 * @returns {Promise<Array<{ url: string, publicId: string }>>}
 */
const uploadManyToCloudinary = async (filePaths, options = {}) => {
  return Promise.all(filePaths.map((fp) => uploadToCloudinary(fp, options)));
};

/**
 * Delete a file from Cloudinary by public ID.
 *
 * @param {string} publicId
 * @param {'image'|'video'|'raw'} [resourceType='image']
 * @returns {Promise<object>} Cloudinary destroy result
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (err) {
    logger.error(`Cloudinary delete error [${publicId}]:`, err);
    throw err;
  }
};

/**
 * Delete multiple Cloudinary assets.
 *
 * @param {string[]} publicIds
 * @param {'image'|'video'|'raw'} [resourceType='image']
 * @returns {Promise<PromiseSettledResult[]>}
 */
const deleteManyFromCloudinary = async (publicIds, resourceType = 'image') => {
  return Promise.allSettled(
    publicIds.map((id) => deleteFromCloudinary(id, resourceType))
  );
};

/**
 * Extract the Cloudinary public_id from a full Cloudinary URL.
 *
 * @param {string} url - Full Cloudinary URL
 * @returns {string|null}
 */
const extractPublicId = (url) => {
  if (!url) return null;
  try {
    // e.g. https://res.cloudinary.com/<cloud>/image/upload/v12345/folder/filename.jpg
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const withVersion = parts[1];
    // Remove version prefix (v123456/) if present
    const withoutVersion = withVersion.replace(/^v\d+\//, '');
    // Remove file extension
    return withoutVersion.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
};

/**
 * Save an uploaded file to a local directory.
 * Used when Cloudinary is not available (e.g. in dev/testing).
 *
 * @param {object} file        - Multer file object
 * @param {string} destination - Target directory (relative to project root)
 * @returns {string} Public URL path (e.g. /uploads/products/filename.jpg)
 */
const saveLocalFile = (file, destination = 'src/public/files') => {
  const dir = path.join(process.cwd(), destination);
  fs.mkdirSync(dir, { recursive: true });

  const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
  const dest = path.join(dir, filename);

  fs.renameSync(file.path, dest);
  return `/${destination}/${filename}`;
};

export {
  uploadToCloudinary,
  uploadManyToCloudinary,
  deleteFromCloudinary,
  deleteManyFromCloudinary,
  extractPublicId,
  saveLocalFile,
};