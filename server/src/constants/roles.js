/**
 * ROLES
 *
 * System-defined role names. These are seeded by bootstrap/seedRoles.js
 * and should never be changed here without a matching DB migration.
 *
 * Custom roles created at runtime via the Role API use free-form names
 * and are NOT listed here.
 *
 * Usage:
 *   import { ROLES } from "../constants/roles.js";
 *   ROLES.SUPERADMIN  →  "superadmin"
 */
 const ROLES = {
  SUPERADMIN: "superadmin", // Full platform access — system managed, cannot be deleted
  ADMIN: "admin",           // Full store management, no role/permission/settings control
  SELLER: "seller",         // Scoped to own store — products, orders, coupons, reviews
};

/**
 * Roles that are seeded by the system and cannot be deleted or renamed via API.
 */
 const SYSTEM_ROLES = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.SELLER];

/**
 * Role hierarchy (higher index = more privileged).
 * Used for guard checks — e.g. an ADMIN cannot manage a SUPERADMIN.
 */
 const ROLE_HIERARCHY = [ROLES.SELLER, ROLES.ADMIN, ROLES.SUPERADMIN];

/**
 * Returns true if `actorRole` outranks `targetRole`.
 *
 * @param {string} actorRole
 * @param {string} targetRole
 * @returns {boolean}
 */
 const hasHigherRole = (actorRole, targetRole) => {
  const actorIndex = ROLE_HIERARCHY.indexOf(actorRole);
  const targetIndex = ROLE_HIERARCHY.indexOf(targetRole);
  return actorIndex > targetIndex;
};

export { ROLES, SYSTEM_ROLES, ROLE_HIERARCHY, hasHigherRole };