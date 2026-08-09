/**
 * Client Brand Controller
 * Thin layer — calls service, sends response.
 */

import * as brandService from "./brand.service.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { MESSAGES } from "../../constants/messages.js";

export const getBrands = asyncHandler(async (req, res) => {
  const result = await brandService.getBrands(req.query);
  sendSuccess(res, {
    message: MESSAGES.BRAND.LIST_FETCHED,
    result,
  });
});

export const getBrand = asyncHandler(async (req, res) => {
  const result = await brandService.getBrand(req.params.slug);
  sendSuccess(res, {
    message: MESSAGES.BRAND.FETCHED,
    result,
  });
});
