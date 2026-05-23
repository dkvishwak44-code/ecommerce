import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Store Scope ──────────────────────────────────────────────────────────────

/**
 * storeScope
 *
 * Ensures the authenticated user can only access resources
 * belonging to their own store.
 *
 * - Superadmin bypasses all store scoping (can access any store)
 * - Admin / manager / staff are restricted to their assigned storeId
 * - Attaches req.storeId for use in controllers/services downstream
 *
 * Must be chained after `protect` or `authenticate`.
 *
 * Usage:
 *   router.get("/products", protect, storeScope, getProducts);
 */
export const storeScope = asyncHandler(async (req, res, next) => {
  const { role, storeId } = req.user;

  // Superadmin sees everything — no scoping applied
  if (role === "superadmin") {
    return next();
  }

  // All other roles must have a storeId in their token
  if (!storeId) {
    throw new AppError("No store assigned to your account. Please contact support.", 403);
  }

  // Attach storeId to req so controllers can filter by it
  req.storeId = storeId;

  // If a storeId param is in the URL, make sure it matches
  if (req.params.storeId && req.params.storeId !== storeId.toString()) {
    throw new AppError("You do not have access to this store.", 403);
  }

  next();
});

// ─── Resource Ownership ───────────────────────────────────────────────────────

/**
 * ownsResource
 *
 * Checks that the authenticated user owns the resource they are
 * trying to access or modify.
 *
 * @param {Function} fetchResource  - async (id) => document
 * @param {string}   ownerField     - field on the document that holds owner id
 *                                    (default: "sellerId")
 *
 * Usage:
 *   router.delete("/:id", protect, ownsResource(
 *     (id) => Product.findById(id),
 *     "sellerId"
 *   ), deleteProduct);
 */
export const ownsResource = (fetchResource, ownerField = "sellerId") =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    // Superadmin bypasses ownership check
    if (role === "superadmin") return next();

    const resource = await fetchResource(id);
    if (!resource) {
      throw new AppError("Resource not found.", 404);
    }

    const ownerId = resource[ownerField]?.toString();
    if (ownerId !== userId.toString()) {
      throw new AppError("You do not have permission to perform this action.", 403);
    }

    // Attach resource to req so controller doesn't need to fetch again
    req.resource = resource;
    next();
  });

// ─── Store Resource Scope ─────────────────────────────────────────────────────

/**
 * storeResourceScope
 *
 * Verifies the resource being accessed belongs to the user's store.
 * Useful for resources that have a storeId field (products, orders, etc.)
 *
 * @param {Function} fetchResource - async (id) => document
 * @param {string}   storeField    - field on the document (default: "storeId")
 *
 * Usage:
 *   router.put("/:id", protect, storeScope, storeResourceScope(
 *     (id) => Product.findById(id)
 *   ), updateProduct);
 */
export const storeResourceScope = (fetchResource, storeField = "storeId") =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.user;

    // Superadmin bypasses
    if (role === "superadmin") return next();

    const resource = await fetchResource(id);
    if (!resource) {
      throw new AppError("Resource not found.", 404);
    }

    const resourceStoreId = resource[storeField]?.toString();
    if (resourceStoreId !== req.storeId?.toString()) {
      throw new AppError("This resource does not belong to your store.", 403);
    }

    req.resource = resource;
    next();
  });

// ─── Self Only ────────────────────────────────────────────────────────────────

/**
 * selfOnly
 *
 * Ensures a user can only access their own record.
 * e.g. a customer can only view/edit their own profile.
 *
 * The :id param must match the authenticated user's id.
 *
 * Usage:
 *   router.get("/:id", protect, selfOnly, getCustomer);
 */
export const selfOnly = asyncHandler(async (req, res, next) => {
  const { role, id: userId } = req.user;

  // Superadmin and admin can access any record
  if (role === "superadmin" || role === "admin") return next();

  if (req.params.id !== userId.toString()) {
    throw new AppError("You can only access your own data.", 403);
  }

  next();
});