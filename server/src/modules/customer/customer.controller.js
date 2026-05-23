/**
 * Customer Controller
 * Thin layer — validates input, calls service, sends response.
 * No business logic lives here.
 */

import * as customerService from "./customer.service.js";
import { sendSuccess }       from "../../utils/response.js";
import { asyncHandler }      from "../../utils/asyncHandler.js";
import { MESSAGES }          from "../../constants/messages.js";
import { HTTP_STATUS }       from "../../constants/status.js";

// ── Profile ───────────────────────────────────────────────────────────────────

/**
 * GET /api/client/v1/customer/profile
 * Returns the logged-in customer's full profile.
 * req.customer is attached by customerAuth.middleware.js
 */
export const getProfile = asyncHandler(async (req, res) => {
  const customer = await customerService.getProfile(req.customer._id);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    MESSAGES.CUSTOMER.FETCHED,
    data:       { customer },
  });
});

/**
 * PATCH /api/client/v1/customer/profile
 * Update name, phone, dateOfBirth, gender, preferences.
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const customer = await customerService.updateProfile(req.customer._id, req.body);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    MESSAGES.CUSTOMER.UPDATED,
    data:       { customer },
  });
});

/**
 * POST /api/client/v1/customer/avatar
 * Upload or replace profile picture.
 * File is processed by upload.middleware.js (multer → temp folder).
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendSuccess(res, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message:    MESSAGES.UPLOAD.FAILED,
    });
  }

  const customer = await customerService.uploadAvatar(req.customer._id, req.file);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    MESSAGES.UPLOAD.SUCCESS,
    data:       { avatar: customer.avatar },
  });
});

/**
 * DELETE /api/client/v1/customer/avatar
 */
export const deleteAvatar = asyncHandler(async (req, res) => {
  await customerService.deleteAvatar(req.customer._id);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    "Avatar removed successfully.",
  });
});

/**
 * DELETE /api/client/v1/customer/account
 * Soft-delete — customer requests account deletion.
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  await customerService.deleteAccount(req.customer._id);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    MESSAGES.CUSTOMER.DELETED,
  });
});

// ── Addresses ─────────────────────────────────────────────────────────────────

/**
 * GET /api/client/v1/addresses
 */
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await customerService.getAddresses(req.customer._id);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    MESSAGES.ADDRESS.LIST_FETCHED,
    data:       { addresses },
  });
});

/**
 * POST /api/client/v1/addresses
 * Body validated by addressSchema in customer.validation.js
 */
export const addAddress = asyncHandler(async (req, res) => {
  const addresses = await customerService.addAddress(req.customer._id, req.body);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message:    MESSAGES.ADDRESS.CREATED,
    data:       { addresses },
  });
});

/**
 * PATCH /api/client/v1/addresses/:addressId
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const addresses = await customerService.updateAddress(
    req.customer._id,
    req.params.addressId,
    req.body
  );

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    MESSAGES.ADDRESS.UPDATED,
    data:       { addresses },
  });
});

/**
 * DELETE /api/client/v1/addresses/:addressId
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const addresses = await customerService.deleteAddress(
    req.customer._id,
    req.params.addressId
  );

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    MESSAGES.ADDRESS.DELETED,
    data:       { addresses },
  });
});

/**
 * PATCH /api/client/v1/addresses/:addressId/default
 */
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const addresses = await customerService.setDefaultAddress(
    req.customer._id,
    req.params.addressId
  );

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message:    MESSAGES.ADDRESS.SET_DEFAULT,
    data:       { addresses },
  });
});