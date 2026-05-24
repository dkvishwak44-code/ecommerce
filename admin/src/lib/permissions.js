/**
 * PERMISSIONS
 * All permissions in dot notation: "resource.action"
 * Single source of truth — import this everywhere
 */
export const PERMISSIONS = {

  // ── Products ──────────────────────────────────────
  PRODUCT_VIEW:    'product.view',
  PRODUCT_CREATE:  'product.create',
  PRODUCT_EDIT:    'product.edit',
  PRODUCT_DELETE:  'product.delete',
  // PRODUCT_PUBLISH: 'product.publish',

  // ── Orders ────────────────────────────────────────
  ORDER_VIEW_OWN:  'order.view_own',
  ORDER_VIEW_ALL:  'order.view_all',
  ORDER_MANAGE:    'order.manage',
  ORDER_REFUND:    'order.refund',
  ORDER_CANCEL:    'order.cancel',

  // ── Users ─────────────────────────────────────────
  USER_VIEW:       'user.view',
  USER_CREATE:     'user.create',
  USER_EDIT:       'user.edit',
  USER_DELETE:     'user.delete',
  // USER_BAN:        'user.ban',

  // ── Reviews ───────────────────────────────────────
  REVIEW_VIEW:     'review.view',
  REVIEW_CREATE:   'review.create',
  REVIEW_DELETE:   'review.delete',
  // REVIEW_MODERATE: 'review.moderate',

  // ── Categories ────────────────────────────────────
  CATEGORY_VIEW:   'category.view',
  CATEGORY_MANAGE: 'category.manage',

  // ── Analytics & Finance ───────────────────────────
  ANALYTICS_VIEW:  'analytics.view',
  REVENUE_VIEW:    'revenue.view',

  // ── Settings ──────────────────────────────────────
  SETTINGS_VIEW:   'settings.view',
  SETTINGS_MANAGE: 'settings.manage',

  // ── Roles & Permissions ───────────────────────────
  ROLE_VIEW:       'role.view',
  ROLE_MANAGE:     'role.manage',
};

/**
 * ROLES — each role gets a set of permissions
 */
export const ROLES = {
  staff: {
    label: 'Staff',
    description: 'Staff',
    permissions: [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.ORDER_VIEW_OWN,
      PERMISSIONS.ORDER_CANCEL,
      PERMISSIONS.REVIEW_VIEW,
      PERMISSIONS.REVIEW_CREATE,
      PERMISSIONS.CATEGORY_VIEW,
    ],
  },
  seller: {
    label: 'Seller',
    description: 'Can list and manage their own products',
    permissions: [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_EDIT,
      PERMISSIONS.PRODUCT_PUBLISH,
      PERMISSIONS.ORDER_VIEW_OWN,
      PERMISSIONS.ORDER_VIEW_ALL,
      PERMISSIONS.ORDER_MANAGE,
      PERMISSIONS.REVIEW_VIEW,
      PERMISSIONS.CATEGORY_VIEW,
    ],
  },

  moderator: {
    label: 'Moderator',
    description: 'Manages reviews and user reports',
    permissions: [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.ORDER_VIEW_OWN,
      PERMISSIONS.REVIEW_VIEW,
      PERMISSIONS.REVIEW_DELETE,
      PERMISSIONS.REVIEW_MODERATE,
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_BAN,
      PERMISSIONS.CATEGORY_VIEW,
    ],
  },

  admin: {
    label: 'Admin',
    description: 'Full store management access',
    permissions: [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_EDIT,
      PERMISSIONS.PRODUCT_DELETE,
      PERMISSIONS.PRODUCT_PUBLISH,
      PERMISSIONS.ORDER_VIEW_OWN,
      PERMISSIONS.ORDER_VIEW_ALL,
      PERMISSIONS.ORDER_MANAGE,
      PERMISSIONS.ORDER_REFUND,
      PERMISSIONS.ORDER_CANCEL,
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_EDIT,
      PERMISSIONS.USER_BAN,
      PERMISSIONS.REVIEW_VIEW,
      PERMISSIONS.REVIEW_DELETE,
      PERMISSIONS.REVIEW_MODERATE,
      PERMISSIONS.CATEGORY_VIEW,
      PERMISSIONS.CATEGORY_MANAGE,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.SETTINGS_MANAGE,
    ],
  },

  super_admin: {
    label: 'Super Admin',
    description: 'Unrestricted access to everything',
    permissions: Object.values(PERMISSIONS), // ALL permissions
  },
};

/**
 * Helper — get permissions array for a role string
 * @param {string} role
 * @returns {string[]}
 */
export function getPermissionsForRole(role) {
  return ROLES[role]?.permissions ?? [];
}

/**
 * Helper — check if a permissions array includes a permission
 * Supports wildcard: "product.*" matches all product.* permissions
 * @param {string[]} userPermissions
 * @param {string} required
 * @returns {boolean}
 */
export function checkPermission(userPermissions, required) {
  if (!userPermissions || !required) return false;

  // Direct match
  if (userPermissions.includes(required)) return true;

  // Wildcard match: e.g. "product.*" grants all product.X
  const [resource] = required.split('.');
  if (userPermissions.includes(`${resource}.*`)) return true;

  return false;
}

/**
 * Helper — check ALL permissions are present
 */
export function checkAllPermissions(userPermissions, required = []) {
  return required.every(p => checkPermission(userPermissions, p));
}

/**
 * Helper — check ANY permission is present
 */
export function checkAnyPermission(userPermissions, required = []) {
  return required.some(p => checkPermission(userPermissions, p));
}
