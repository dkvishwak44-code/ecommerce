import { verifyAccessToken } from "../utils/jwt.js";
import authRepository        from "../modules/auth/auth.repository.js";
import { AppError }          from "../utils/AppError.js";
import { asyncHandler }      from "../utils/asyncHandler.js";

// ─── Standard Auth Guard ──────────────────────────────────────────────────────

const protect = asyncHandler(async (req, res, next) => {
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
  
  const user = await authRepository.findUserById(decoded.id);
  if (!user)          throw new AppError("User no longer exists", 401);
  if (!user.status === "active") throw new AppError("Account is deactivated", 403);
  
  if (user.isFirstLogin) {
    throw new AppError("Please change your system-generated password before proceeding.", 403);
  }

  if (
    user.passwordChangedAt &&
    decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)
  ) {
    throw new AppError("Password was recently changed. Please log in again.", 401);
  }
  req.user = decoded;
  next();
});

// ─── First-Login Scope Guard ──────────────────────────────────────────────────

const protectFirstLogin = asyncHandler(async (req, res, next) => {
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

  const user = await authRepository.findUserById(decoded.id);
  if (!user)          throw new AppError("User not found", 401);
  if (!user.isActive) throw new AppError("Account is deactivated", 403);

  if (!user.isFirstLogin) {
    throw new AppError("Password already changed. Please use the standard login flow.", 400);
  }

  req.user = decoded;
  next();
});

// ─── Authenticate ─────────────────────────────────────────────────────────────

const authenticate = asyncHandler(async (req, res, next) => {
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

  let authUser = null;

  if (decoded.roleName === "customer") {
    // ── Customer — no role/permission population needed ───────────────────────
    const { default: Customer } = await import("../modules/customer/customer.model.js");

    authUser = await Customer.findById(decoded.id)
      .select("+isActive +isFirstLogin +passwordChangedAt")
      .lean();

    if (!authUser) throw new AppError("Customer account not found.", 401);

  } else {
    // ── Admin / staff — populate role + permissions ───────────────────────────
    const { default: User } = await import("../modules/user/user.model.js");

    authUser = await User.findById(decoded.id)
      .select("+isActive +isFirstLogin +passwordChangedAt +isSuperAdmin")
      .populate({
        path:  "role",
        select: "name isActive",
        populate: {
          path:   "permissions",
          select: "slug name isActive",
          match:  { isActive: true }, // only active permissions
        },
      })
      .lean();

    if (!authUser) throw new AppError("User account not found.", 401);
  }

  // ── Common checks ─────────────────────────────────────────────────────────
  if (!authUser.isActive) {
    throw new AppError("Your account has been deactivated. Please contact support.", 403);
  }

  if (authUser.isFirstLogin) {
    throw new AppError("Please change your system-generated password before proceeding.", 403);
  }

  if (
    authUser.passwordChangedAt &&
    decoded.iat < Math.floor(new Date(authUser.passwordChangedAt).getTime() / 1000)
  ) {
    throw new AppError("Password was recently changed. Please log in again.", 401);
  }

  // ── Build flat permission slug array ──────────────────────────────────────
  // Superadmin gets a wildcard marker — checkPermission() bypasses for them
  const permissionSlugs = authUser.isSuperAdmin
    ? ["*"] // wildcard — all permissions granted
    : (authUser.role?.permissions ?? []).map((p) => p.slug);

  // ── Attach to request ─────────────────────────────────────────────────────
  req.user        = decoded;    // JWT payload   — id, role, iat, exp
  req.authUser    = authUser;   // DB document   — full user/customer record
  req.role        = authUser.role ?? null;        // populated Role document
  req.permissions = permissionSlugs;              // ["user:list", "user:create", ...]

  // Convenience aliases
  if (decoded.role === "customer") {
    req.customer = authUser;
  } else {
    req.admin = authUser;
  }

  next();
});

// ─── Role Guard ───────────────────────────────────────────────────────────────

const restrictTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    
    if (!roles.includes(req.user.roleName)) {
      throw new AppError("You do not have permission to perform this action.", 403);
    }
    next();
  });

// ─── Permission Guard ─────────────────────────────────────────────────────────

/**
 * checkPermission
 *
 * Verifies the authenticated user has the required permission slug.
 *
 * Strategy:
 *   1. Superadmin bypasses all permission checks
 *   2. Populate the user's role with its permissions
 *   3. Check if the required permission slug exists in role.permissions
 *
 * Must be chained after `protect` or `authenticate`.
 *
 * Usage:
 *   router.get("/users", protect, checkPermission("user:list"), getUsers);
 *   router.post("/users", protect, checkPermission("user:create"), createUser);
 *   router.delete("/users/:id", protect, checkPermission("user:delete"), deleteUser);
 */
const checkPermission = (requiredPermission) =>
  
  asyncHandler(async (req, res, next) => {
    
    const { id, role } = req.user;

    // Superadmin bypasses all permission checks
    if (role === "superadmin" || req.authUser?.isSuperAdmin) {
      return next();
    }

    // Populate role with permissions
    const { default: User } = await import("../modules/user/user.model.js");
    const { default: Role } = await import("../modules/role/role.model.js");

    // Get user with role populated
    const user = await User.findById(id)
      .populate({
        path:     "role",
        populate: {
          path:   "permissions",
          select: "slug isActive",
        },
      })
      .lean();

    if (!user) throw new AppError("User not found.", 401);

    // Check if role has permissions
    const permissions = user.role?.permissions ?? [];

    if (!permissions.length) {
      throw new AppError(
        "Your role has no permissions assigned. Please contact support.",
        403
      );
    }

    // Check if required permission exists and is active
    const hasPermission = permissions.some(
      (p) => p.slug === requiredPermission && p.isActive !== false
    );

    if (!hasPermission) {
      throw new AppError(
        `Access denied. Required permission: "${requiredPermission}".`,
        403
      );
    }

    // Attach resolved permissions to req for downstream use
    req.permissions = permissions.map((p) => p.slug);

    next();
  });

// ─── Multi-Permission Guard ───────────────────────────────────────────────────

/**
 * checkAnyPermission
 *
 * Passes if the user has AT LEAST ONE of the listed permissions.
 * Useful for routes accessible by multiple roles with different permissions.
 *
 * Usage:
 *   router.get("/reports",
 *     protect,
 *     checkAnyPermission("analytics:read", "dashboard:analytics"),
 *     getReports
 *   );
 */
const checkAnyPermission = (...requiredPermissions) =>
  asyncHandler(async (req, res, next) => {
    const { id, role } = req.user;

    // Superadmin bypasses
    if (role === "superadmin" || req.authUser?.isSuperAdmin) {
      return next();
    }

    const { default: User } = await import("../modules/user/user.model.js");

    const user = await User.findById(id)
      .populate({
        path:     "role",
        populate: {
          path:   "permissions",
          select: "slug isActive",
        },
      })
      .lean();

    if (!user) throw new AppError("User not found.", 401);

    const permissions  = user.role?.permissions ?? [];
    const slugs        = permissions
      .filter((p) => p.isActive !== false)
      .map((p) => p.slug);

    const hasAny = requiredPermissions.some((p) => slugs.includes(p));

    if (!hasAny) {
      throw new AppError(
        `Access denied. Required one of: "${requiredPermissions.join('", "')}".`,
        403
      );
    }

    req.permissions = slugs;
    next();
  });

// ─── All-Permission Guard ─────────────────────────────────────────────────────

/**
 * checkAllPermissions
 *
 * Passes only if the user has ALL listed permissions.
 *
 * Usage:
 *   router.post("/products",
 *     protect,
 *     checkAllPermissions("product:create", "store:read"),
 *     createProduct
 *   );
 */
const checkAllPermissions = (...requiredPermissions) =>
  asyncHandler(async (req, res, next) => {
    const { id, role } = req.user;

    // Superadmin bypasses
    if (role === "superadmin" || req.authUser?.isSuperAdmin) {
      return next();
    }

    const { default: User } = await import("../modules/user/user.model.js");

    const user = await User.findById(id)
      .populate({
        path:     "role",
        populate: {
          path:   "permissions",
          select: "slug isActive",
        },
      })
      .lean();

    if (!user) throw new AppError("User not found.", 401);

    const permissions = user.role?.permissions ?? [];
    const slugs       = permissions
      .filter((p) => p.isActive !== false)
      .map((p) => p.slug);

    const missing = requiredPermissions.filter((p) => !slugs.includes(p));

    if (missing.length) {
      throw new AppError(
        `Access denied. Missing permissions: "${missing.join('", "')}".`,
        403
      );
    }

    req.permissions = slugs;
    next();
  });

// ─── Optional Auth ────────────────────────────────────────────────────────────

const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const token   = _extractBearerToken(req);
    const decoded = verifyAccessToken(token);
    if (!decoded.scope) {
      req.user = decoded;
    }
  } catch (_) {
    // silently pass
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
  protect,
  protectFirstLogin,
  authenticate,
  restrictTo,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  optionalAuth,
};