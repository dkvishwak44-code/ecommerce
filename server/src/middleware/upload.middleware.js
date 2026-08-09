/**
 * Upload Middleware
 * Multer configuration for file uploads.
 * Files are stored temporarily on disk, then uploaded to Cloudinary by the service layer.
 */

import multer from "multer";
import path from "path";
import { AppError } from "../utils/AppError.js";

// ── Storage ───────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ── File Filter ───────────────────────────────────────────────────────────────
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const fileFilter = (_req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Allowed: jpg, jpeg, png, webp, gif, pdf.",
        400
      ),
      false
    );
  }
};

// ── Multer Instance ───────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

/**
 * Upload a single file.
 * @param {string} folder - Logical folder name (for organization)
 * @param {string} fieldName - Form field name
 */
export const uploadSingle = (folder, fieldName = "file") => {
  return upload.single(fieldName);
};

/**
 * Upload multiple files.
 * @param {string} folder - Logical folder name
 * @param {string} fieldName - Form field name
 * @param {number} maxCount - Max number of files
 */
export const uploadMultiple = (folder, fieldName = "files", maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

export default upload;
