
// utils/cloudinary.utils.js
import { cloudinary } from "../config/cloudinary.js";
 
// ── Upload from file path or base64 ──────────────────────────
export const uploadToCloudinary = async (filePath, folder = "shopsphere") => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
  });
  return {
    url:      result.secure_url,
    publicId: result.public_id,
  };
};

// ── Delete by public_id ───────────────────────────────────────
export const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

// ── Delete multiple ───────────────────────────────────────────
export const deleteManyFromCloudinary = async (publicIds = []) => {
  const promises = publicIds.map((id) => cloudinary.uploader.destroy(id));
  return Promise.all(promises);
};