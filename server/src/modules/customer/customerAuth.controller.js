/**
 * Customer Auth Controller
 * Controller handlers for storefront customer authentication.
 */

import * as customerAuthService from "./customerAuth.service.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { HTTP_STATUS } from "../../constants/status.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const register = asyncHandler(async (req, res) => {
  const result = await customerAuthService.register(req.body);
  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: result.message,
    result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const meta = {
    ip: req.ip || req.headers["x-forwarded-for"],
    userAgent: req.headers["user-agent"],
  };

  const result = await customerAuthService.login(req.body.email, req.body.password, meta);

  if (result.refreshToken) {
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
  }

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: result.message,
    result,
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await customerAuthService.verifyOtp(email, otp);

  if (result.refreshToken) {
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
  }

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: result.message,
    result,
  });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await customerAuthService.resendOtp(email);
  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: result.message,
    result,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await customerAuthService.forgotPassword(email);
  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: result.message,
    result,
  });
});

export const resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await customerAuthService.resetPasswordWithOtp(email, otp, newPassword);
  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: result.message,
    result,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await customerAuthService.resetPassword(req.body);
  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: result.message,
    result,
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const meta = {
    ip: req.ip || req.headers["x-forwarded-for"],
    userAgent: req.headers["user-agent"],
  };

  const result = await customerAuthService.refreshAccessToken(rawToken, meta);

  if (result.refreshToken) {
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
  }

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: "Token refreshed successfully.",
    result,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const customerId = req.customer?._id || req.user?.id;
  const result = await customerAuthService.logout(rawToken, customerId);

  res.clearCookie("refreshToken", cookieOptions);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: result.message,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const customerId = req.customer?._id || req.user?.id;
  const { currentPassword, newPassword } = req.body;
  const result = await customerAuthService.changePassword(customerId, currentPassword, newPassword);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: result.message,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const customerId = req.customer?._id || req.user?.id;
  const customer = await customerAuthService.getMe(customerId);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: "Customer profile fetched successfully.",
    result: { customer },
  });
});
