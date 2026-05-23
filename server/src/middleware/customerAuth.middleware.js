"use strict";

import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";
import Customer from "../modules/customer/customer.model.js"; // ← top-level import, no more require()

// ─── Customer Protect ─────────────────────────────────────────────────────────

const customerProtect = asyncHandler(async (req, res, next) => {
  const token = _extractBearerToken(req);

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new AppError("Invalid or expired access token. Please log in again.", 401);
  }

  if (decoded.scope) {
    throw new AppError("Restricted token. Please complete the required action first.", 403);
  }

  const customer = await Customer.findById(decoded.id).select(
    "+isActive +isFirstLogin +passwordChangedAt"
  );

  if (!customer) throw new AppError("Customer account not found.", 401);

  if (!customer.isActive) {
    throw new AppError("Your account has been deactivated. Please contact support.", 403);
  }

  if (customer.isFirstLogin) {
    throw new AppError("Please change your system-generated password before proceeding.", 403);
  }

  if (
    customer.passwordChangedAt &&
    decoded.iat < Math.floor(customer.passwordChangedAt.getTime() / 1000)
  ) {
    throw new AppError("Password was recently changed. Please log in again.", 401);
  }

  req.user = decoded;
  req.customer = customer;
  next();
});

// ─── Customer First-Login Scope Guard ────────────────────────────────────────

const customerProtectFirstLogin = asyncHandler(async (req, res, next) => {
  const token = _extractBearerToken(req);

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }

  if (decoded.scope !== "change_password") {
    throw new AppError("This endpoint requires a first-login token", 403);
  }

  const customer = await Customer.findById(decoded.id).select(
    "+isActive +isFirstLogin"
  );

  if (!customer) throw new AppError("Customer not found", 401);
  if (!customer.isActive) throw new AppError("Account is deactivated", 403);

  if (!customer.isFirstLogin) {
    throw new AppError("Password already changed. Please use the standard login flow.", 400);
  }

  req.user = decoded;
  req.customer = customer;
  next();
});

// ─── Customer Authenticate ────────────────────────────────────────────────────

/**
 * customerAuthenticate
 *
 * Flexible guard that works for BOTH admin users and customers.
 * - Verifies the JWT access token
 * - Resolves the identity from either the User or Customer collection
 *   based on the role embedded in the token payload
 * - Blocks scoped tokens (e.g. firstLoginToken)
 * - Blocks inactive accounts and first-login-pending accounts
 * - Attaches req.user (decoded payload) and req.authUser (DB document)
 *
 * Use this on shared routes accessible by both admins and customers.
 */
const customerAuthenticate = asyncHandler(async (req, res, next) => {
  const token = _extractBearerToken(req);

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new AppError("Invalid or expired access token. Please log in again.", 401);
  }

  // Block scoped tokens
  if (decoded.scope) {
    throw new AppError("Restricted token. Please complete the required action first.", 403);
  }

  let authUser = null;

  if (decoded.role === "customer") {
    // ── Resolve from Customer collection ──────────────────────────────────────
    authUser = await Customer.findById(decoded.id).select(
      "+isActive +isFirstLogin +passwordChangedAt"
    );

    if (!authUser) throw new AppError("Customer account not found.", 401);

    if (!authUser.isActive) {
      throw new AppError("Your account has been deactivated. Please contact support.", 403);
    }

    if (authUser.isFirstLogin) {
      throw new AppError("Please change your system-generated password before proceeding.", 403);
    }
  } else {
    // ── Resolve from User collection (admin / staff / manager) ───────────────
    const { default: User } = await import("../modules/user/user.model.js");

    authUser = await User.findById(decoded.id).select(
      "+isActive +isFirstLogin +passwordChangedAt"
    );

    if (!authUser) throw new AppError("User account not found.", 401);

    if (!authUser.isActive) {
      throw new AppError("Your account has been deactivated. Please contact support.", 403);
    }

    if (authUser.isFirstLogin) {
      throw new AppError("Please change your system-generated password before proceeding.", 403);
    }
  }

  // ── Invalidate token if password changed after it was issued ─────────────
  if (
    authUser.passwordChangedAt &&
    decoded.iat < Math.floor(authUser.passwordChangedAt.getTime() / 1000)
  ) {
    throw new AppError("Password was recently changed. Please log in again.", 401);
  }

  req.user     = decoded;   // JWT payload  — id, role, scope, iat, exp
  req.authUser = authUser;  // DB document  — full customer or user record

  // Convenience aliases
  if (decoded.role === "customer") {
    req.customer = authUser;
  } else {
    req.admin = authUser;
  }

  next();
});

// ─── Optional Customer Auth ───────────────────────────────────────────────────

const customerOptionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const token = _extractBearerToken(req);
    const decoded = verifyAccessToken(token);

    if (!decoded.scope && decoded.role === "customer") {
      req.user = decoded;
    }
  } catch (_) {
    // silently pass
  }
  next();
});

// ─── Role check — customer only ───────────────────────────────────────────────

const isCustomer = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "customer") {
    throw new AppError("Access restricted to customers only.", 403);
  }
  next();
});

// ─── Helper ───────────────────────────────────────────────────────────────────

function _extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided. Please log in.", 401);
  }
  return authHeader.split(" ")[1];
}

export {
  customerProtect,
  customerProtectFirstLogin,
  customerAuthenticate,
  customerOptionalAuth,
  isCustomer,
};