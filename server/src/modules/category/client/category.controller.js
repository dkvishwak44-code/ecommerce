/**
 * Client Category Controller
 * Thin layer — calls service, sends response.
 */

import * as categoryService from "./category.service.js";
import { sendSuccess } from "../../../utils/response.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { MESSAGES } from "../../../constants/messages.js";

export const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories(req.query);
  sendSuccess(res, {
    message: MESSAGES.CATEGORY.LIST_FETCHED,
    result,
  });
});

export const getCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategory(req.params.slug);
  sendSuccess(res, {
    message: MESSAGES.CATEGORY.FETCHED,
    result,
  });
});

export const getCategoryTree = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategoryTree();
  sendSuccess(res, {
    message: MESSAGES.CATEGORY.LIST_FETCHED,
    result,
  });
});
