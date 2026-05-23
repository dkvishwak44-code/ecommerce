import Role from "../modules/role/role.model.js";
import Permission from "../modules/permission/permission.model.js";
import { ROLES } from "../constants/roles.js";
import {logger} from "../config/logger.js";

/**
 * Role definitions:
 *
 * SUPERADMIN — Full access to every permission in the system.
 *              Cannot be deleted or modified via the API.
 *
 * ADMIN      — Full access except a few superadmin-only actions
 *              (e.g. managing roles/permissions, system settings).
 *
 * SELLER     — Scoped to their own store: products, orders, analytics,
 *              reviews, coupons, and banners for their store only.
 *
 * Custom roles can be created at runtime via the Role API and are NOT
 * seeded here.
 */

// Modules that only a SUPERADMIN should control
const SUPERADMIN_ONLY_MODULES = ["role", "permission", "audit", "settings"];

// Modules a SELLER can access (always scoped to their store via middleware)
const SELLER_MODULES = [
  "product",
  "order",
  "coupon",
  "review",
  "banner",
  "analytics",
  "notification",
  "store",
];

const SELLER_EXCLUDED_ACTIONS = ["delete"]; // sellers cannot hard-delete most resources

export const seedRoles = async () => {
  try {
    logger.info("🎭 Seeding roles...");

    // Fetch all permissions from DB (already seeded by seedPermissions)
    const allPermissions = await Permission.find({});
    const allPermissionIds = allPermissions.map((p) => p._id);

    // ── SUPERADMIN ────────────────────────────────────────────────────────────
    await upsertRole({
      name: ROLES.SUPERADMIN,
      displayName: "Super Admin",
      description:
        "Unrestricted access to the entire platform. System-managed — cannot be deleted.",
      permissions: allPermissionIds,
      isSystem: true,       // prevents deletion/modification via API
      isDefault: false,
    });

    // ── ADMIN ─────────────────────────────────────────────────────────────────
    const adminPermissions = allPermissions
      .filter((p) => !SUPERADMIN_ONLY_MODULES.includes(p.module))
      .map((p) => p._id);

    await upsertRole({
      name: ROLES.ADMIN,
      displayName: "Admin",
      description:
        "Full store management access. Cannot manage roles/permissions or system settings.",
      permissions: adminPermissions,
      isSystem: true,
      isDefault: false,
    });

    // ── SELLER ────────────────────────────────────────────────────────────────
    const sellerPermissions = allPermissions
      .filter(
        (p) =>
          SELLER_MODULES.includes(p.module) &&
          !SELLER_EXCLUDED_ACTIONS.includes(p.action)
      )
      .map((p) => p._id);

    await upsertRole({
      name: ROLES.SELLER,
      displayName: "Seller",
      description:
        "Access to manage their own store — products, orders, coupons, reviews, and analytics.",
      permissions: sellerPermissions,
      isSystem: true,
      isDefault: false,
    });

    logger.info("✅ Roles seeded — superadmin, admin, seller.");
  } catch (err) {
    logger.error("❌ Failed to seed roles:", err);
    throw err;
  }
};

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Upsert a role by name.
 * If the role already exists, only its permissions list is refreshed
 * (so newly seeded permissions are automatically picked up).
 */
const upsertRole = async ({ name, displayName, description, permissions, isSystem, isDefault }) => {
  await Role.updateOne(
    { name },
    {
      $set: {
        displayName,
        description,
        permissions,
        isSystem,
        isDefault,
      },
    },
    { upsert: true }
  );
};