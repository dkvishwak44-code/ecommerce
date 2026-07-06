// config/multer.config.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.js";

// ── Product Images Storage ────────────────────────────────────
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "shopsphere/products",   // cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// ── Avatar Storage ────────────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "shopsphere/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face" }],
  },
});

// ── Store Logo Storage ────────────────────────────────────────
const storeLogoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "shopsphere/stores/logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  },
});

export const uploadProductImages = multer({
  storage: productStorage,
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5MB max
}).array("images", 5);                     // max 5 images

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits:  { fileSize: 2 * 1024 * 1024 }, // 2MB max
}).single("avatar");

export const uploadStoreLogo = multer({
  storage: storeLogoStorage,
  limits:  { fileSize: 2 * 1024 * 1024 },
}).single("logo");