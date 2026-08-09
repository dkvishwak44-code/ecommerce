/**
 * Client Store Controller
 * Thin layer — calls service, sends response.
 */

import * as storeService from "./store.service.js";
import { sendSuccess } from "../../../utils/response.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { MESSAGES } from "../../../constants/messages.js";

export const getStores = asyncHandler(async (req, res) => {
  const result = await storeService.getStores(req.query);
  sendSuccess(res, {
    message: MESSAGES.STORE.LIST_FETCHED,
    result,
  });
});

export const getStore = asyncHandler(async (req, res) => {
  const result = await storeService.getStore(req.params.slug);
  sendSuccess(res, {
    message: MESSAGES.STORE.FETCHED,
    result,
  });
});

export const getStoreProducts = asyncHandler(async (req, res) => {
  const result = await storeService.getStoreProducts(req.params.slug, req.query);
  sendSuccess(res, {
    message: MESSAGES.PRODUCT.LIST_FETCHED,
    result,
  });
});
