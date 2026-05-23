/**
 * Customer Service
 * Business logic for the client-facing customer module.
 * Called by customer.controller — never called directly by routes.
 */

import * as customerRepo from "./customer.repository.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/uploadFile.js";


// import { AppError }   from "../utils/response.js";

import { MESSAGES }   from "../../constants/messages.js";
import { HTTP_STATUS } from "../../constants/status.js";
import { AppError } from "../../utils/AppError.js";

// ── Profile ───────────────────────────────────────────────────────────────────

/**
 * Get the logged-in customer's profile.
 * req.customer is set by customerAuth.middleware.js after JWT verification.
 */
export const getProfile = async (customerId) => {
  const customer = await customerRepo.findById(customerId);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  return customer;
};

/**
 * Update profile fields (name, phone, dob, gender, preferences).
 * Email change is intentionally NOT allowed here — requires OTP re-verification.
 */
export const updateProfile = async (customerId, data) => {
  // Strip fields that should not be updated via this endpoint
  const { email, password, status, isVerified, otp, ...safeData } = data;

  const customer = await customerRepo.updateCustomerById(customerId, safeData);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  return customer;
};

/**
 * Upload or replace the customer's avatar.
 * Old image is deleted from Cloudinary before uploading the new one.
 */
export const uploadAvatar = async (customerId, file) => {
  const customer = await customerRepo.findById(customerId);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  // Delete old avatar from Cloudinary if it exists
  if (customer.avatar?.publicId) {
    await deleteFromCloudinary(customer.avatar.publicId);
  }

  const { url, public_id } = await uploadToCloudinary(file.path, "customers/avatars");

  return customerRepo.updateCustomerById(customerId, {
    avatar: { url, publicId: public_id },
  });
};

/**
 * Remove avatar and delete from Cloudinary.
 */
export const deleteAvatar = async (customerId) => {
  const customer = await customerRepo.findById(customerId);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  if (customer.avatar?.publicId) {
    await deleteFromCloudinary(customer.avatar.publicId);
  }

  return customerRepo.updateCustomerById(customerId, {
    avatar: { url: null, publicId: null },
  });
};

/**
 * Soft-delete the customer's own account.
 * Data is retained for order history and audit purposes.
 */
export const deleteAccount = async (customerId) => {
  const customer = await customerRepo.findById(customerId);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  await customer.softDelete();
};

// ── Addresses ─────────────────────────────────────────────────────────────────

export const getAddresses = async (customerId) => {
  const customer = await customerRepo.findById(customerId);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  return customer.addresses;
};

export const addAddress = async (customerId, addressData) => {
  const customer = await customerRepo.addAddress(customerId, addressData);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  return customer.addresses;
};

export const updateAddress = async (customerId, addressId, addressData) => {
  const customer = await customerRepo.updateAddress(customerId, addressId, addressData);
  if (!customer) throw new AppError(MESSAGES.ADDRESS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  return customer.addresses;
};

export const deleteAddress = async (customerId, addressId) => {
  // Guard: cannot delete the only address if it is the default
  const customer = await customerRepo.findById(customerId);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  const address = customer.addresses.id(addressId);
  if (!address) throw new AppError(MESSAGES.ADDRESS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  if (customer.addresses.length === 1) {
    throw new AppError("Cannot delete your only saved address.", HTTP_STATUS.BAD_REQUEST);
  }

  const updated = await customerRepo.deleteAddress(customerId, addressId);
  return updated.addresses;
};

export const setDefaultAddress = async (customerId, addressId) => {
  const customer = await customerRepo.findById(customerId);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  const address = customer.addresses.id(addressId);
  if (!address) throw new AppError(MESSAGES.ADDRESS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  const updated = await customerRepo.setDefaultAddress(customerId, addressId);
  return updated.addresses;
};