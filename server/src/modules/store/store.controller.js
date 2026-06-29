import * as storeService from "./store.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/AppError.js";

export const createStore = asyncHandler(async (req, res) => {
  const store = await storeService.createStore(req.user.id, req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Store created successfully.",
    result: { store },
  });
});

export const createStoreByAdmin = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError("Request body is required.", 400);
  }

  const store = await storeService.createStoreByAdmin(req.body, req.user.id);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Store created successfully.",
    result: { store },
  });
});

export const getMyStore = asyncHandler(async (req, res) => {
  const store = await storeService.getMyStore(req.user.id);
  return sendSuccess(res, {
    message: "Store fetched successfully.",
    result: { store },
  });
});

export const getStoreById = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreById(req.params.id);
  return sendSuccess(res, {
    message: "Store fetched successfully.",
    result: { store },
  });
});

export const getStoreBySlug = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreBySlug(req.params.slug);
  return sendSuccess(res, {
    message: "Store fetched successfully.",
    result: { store },
  });
});

export const listAllStores = asyncHandler(async (req, res) => {
  const result = await storeService.listAllStores(req.query);
  return sendSuccess(res, {
    message: "Stores fetched successfully.",
    result,
  });
});

export const updateStore = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
  const store = await storeService.updateStore(req.params.id, req.user.id, req.body, isAdmin);
  return sendSuccess(res, {
    message: "Store updated successfully.",
    result: { store },
  });
});

export const updateStoreByAdmin = asyncHandler(async (req, res) => {
  const store = await storeService.updateStoreByAdmin(req.params.id, req.body, req.user.id);
  return sendSuccess(res, {
    message: "Store updated successfully.",
    result: { store },
  });
});

export const updateBankDetails = asyncHandler(async (req, res) => {
  const store = await storeService.updateBankDetails(req.params.id, req.user.id, req.body);
  return sendSuccess(res, {
    message: "Bank details updated successfully.",
    result: { store },
  });
});

export const verifyStore = asyncHandler(async (req, res) => {
  const store = await storeService.verifyStore(req.params.id, req.user.id);
  return sendSuccess(res, {
    message: "Store verified successfully.",
    result: { store },
  });
});

export const rejectStore = asyncHandler(async (req, res) => {
  const store = await storeService.rejectStore(req.params.id, req.body.reason);
  return sendSuccess(res, {
    message: "Store rejected successfully.",
    result: { store },
  });
});

export const toggleStoreActive = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  if (typeof isActive !== "boolean") {
    throw new AppError("isActive must be a boolean.", 400);
  }

  const store = await storeService.toggleStoreActive(req.params.id, isActive);
  return sendSuccess(res, {
    message: `Store ${isActive ? "activated" : "deactivated"} successfully.`,
    result: { store },
  });
});

export const addMember = asyncHandler(async (req, res) => {
  const { userId, roleId } = req.body;
  const store = await storeService.addMember(req.params.id, req.user.id, { userId, roleId });
  return sendSuccess(res, {
    message: "Member added successfully.",
    result: { store },
  });
});

export const removeMember = asyncHandler(async (req, res) => {
  const store = await storeService.removeMember(req.params.id, req.user.id, req.params.userId);
  return sendSuccess(res, {
    message: "Member removed successfully.",
    result: { store },
  });
});

export const deleteStore = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
  await storeService.deleteStore(req.params.id, req.user.id, isAdmin);
  return sendSuccess(res, {
    message: "Store deleted successfully.",
  });
});
