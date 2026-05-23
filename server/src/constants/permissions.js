/**
 * PERMISSIONS
 *
 * Dot notation format: "module.action"
 * Grouped by module for easy role assignment and UI rendering.
 *
 * Usage:
 *   import { PERMISSIONS } from "../constants/permissions.js";
 *   PERMISSIONS.PRODUCT.CREATE  →  "product.create"
 */

export const PERMISSIONS = {
  // ── Auth ───────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN:           "auth.login",
    LOGOUT:          "auth.logout",
    REFRESH_TOKEN:   "auth.refresh_token",
    FORGOT_PASSWORD: "auth.forgot_password",
    RESET_PASSWORD:  "auth.reset_password",
    CHANGE_PASSWORD: "auth.change_password",
    VERIFY_OTP:      "auth.verify_otp",
    RESEND_OTP:      "auth.resend_otp",
  },

  // ── User ───────────────────────────────────────────────────────────────────
  USER: {
    CREATE:         "user.create",
    READ:           "user.read",
    READ_ALL:       "user.read_all",
    UPDATE:         "user.update",
    DELETE:         "user.delete",
    ACTIVATE:       "user.activate",
    DEACTIVATE:     "user.deactivate",
    CHANGE_ROLE:    "user.change_role",
    RESET_PASSWORD: "user.reset_password",
    EXPORT:         "user.export",
  },

  // ── Role ───────────────────────────────────────────────────────────────────
  ROLE: {
    CREATE:             "role.create",
    READ:               "role.read",
    READ_ALL:           "role.read_all",
    UPDATE:             "role.update",
    DELETE:             "role.delete",
    ASSIGN_PERMISSIONS: "role.assign_permissions",
  },

  // ── Permission ─────────────────────────────────────────────────────────────
  PERMISSION: {
    READ:     "permission.read",
    READ_ALL: "permission.read_all",
  },

  // ── Store / Company ────────────────────────────────────────────────────────
  STORE: {
    CREATE:     "store.create",
    READ:       "store.read",
    READ_ALL:   "store.read_all",
    UPDATE:     "store.update",
    DELETE:     "store.delete",
    ACTIVATE:   "store.activate",
    DEACTIVATE: "store.deactivate",
    VERIFY:     "store.verify",
    EXPORT:     "store.export",
  },

  // ── Product ────────────────────────────────────────────────────────────────
  PRODUCT: {
    CREATE:           "product.create",
    READ:             "product.read",
    READ_ALL:         "product.read_all",
    UPDATE:           "product.update",
    DELETE:           "product.delete",
    PUBLISH:          "product.publish",
    UNPUBLISH:        "product.unpublish",
    MANAGE_VARIANTS:  "product.manage_variants",
    MANAGE_INVENTORY: "product.manage_inventory",
    MANAGE_IMAGES:    "product.manage_images",     // upload / reorder / delete product images
    MANAGE_PRICING:   "product.manage_pricing",    // change price, compare price, cost price
    BULK_UPDATE:      "product.bulk_update",       // bulk status / category / price change
    BULK_DELETE:      "product.bulk_delete",
    IMPORT:           "product.import",
    EXPORT:           "product.export",
    VIEW_ANALYTICS:   "product.view_analytics",    // per-product sales & view stats
  },

  // ── Category ───────────────────────────────────────────────────────────────
  CATEGORY: {
    CREATE:   "category.create",
    READ:     "category.read",
    READ_ALL: "category.read_all",
    UPDATE:   "category.update",
    DELETE:   "category.delete",
    REORDER:  "category.reorder",
  },

  // ── Brand ──────────────────────────────────────────────────────────────────
  BRAND: {
    CREATE:   "brand.create",
    READ:     "brand.read",
    READ_ALL: "brand.read_all",
    UPDATE:   "brand.update",
    DELETE:   "brand.delete",
  },

  // ── Order ──────────────────────────────────────────────────────────────────
  ORDER: {
    READ:                    "order.read",
    READ_ALL:                "order.read_all",
    UPDATE_STATUS:           "order.update_status",        // move order through lifecycle
    CANCEL:                  "order.cancel",
    REFUND:                  "order.refund",
    ASSIGN:                  "order.assign",               // assign to delivery agent / store
    APPROVE_RETURN:          "order.approve_return",       // approve customer return request
    REJECT_RETURN:           "order.reject_return",        // reject customer return request
    GENERATE_INVOICE:        "order.generate_invoice",
    GENERATE_SHIPPING_LABEL: "order.generate_shipping_label",
    ADD_NOTE:                "order.add_note",             // internal order notes
    VIEW_PAYMENT_DETAILS:    "order.view_payment_details", // see gateway txn id, amounts
    EXPORT:                  "order.export",
    BULK_UPDATE_STATUS:      "order.bulk_update_status",   // bulk status change from list view
  },

  // ── Coupon ─────────────────────────────────────────────────────────────────
  COUPON: {
    CREATE:     "coupon.create",
    READ:       "coupon.read",
    READ_ALL:   "coupon.read_all",
    UPDATE:     "coupon.update",
    DELETE:     "coupon.delete",
    ACTIVATE:   "coupon.activate",
    DEACTIVATE: "coupon.deactivate",
    EXPORT:     "coupon.export",
  },

  // ── Review ─────────────────────────────────────────────────────────────────
  REVIEW: {
    READ:     "review.read",
    READ_ALL: "review.read_all",
    APPROVE:  "review.approve",
    REJECT:   "review.reject",
    DELETE:   "review.delete",
    REPLY:    "review.reply",
  },

  // ── Banner ─────────────────────────────────────────────────────────────────
  BANNER: {
    CREATE:     "banner.create",
    READ:       "banner.read",
    READ_ALL:   "banner.read_all",
    UPDATE:     "banner.update",
    DELETE:     "banner.delete",
    ACTIVATE:   "banner.activate",
    DEACTIVATE: "banner.deactivate",
    REORDER:    "banner.reorder",
  },

  // ── Customer ───────────────────────────────────────────────────────────────
  CUSTOMER: {
    READ:        "customer.read",
    READ_ALL:    "customer.read_all",
    UPDATE:      "customer.update",
    DELETE:      "customer.delete",
    ACTIVATE:    "customer.activate",
    DEACTIVATE:  "customer.deactivate",
    VIEW_ORDERS: "customer.view_orders",
    EXPORT:      "customer.export",
  },

  // ── Dashboard ──────────────────────────────────────────────────────────────
  // Scoped widgets — roles only see the widgets relevant to them.
  DASHBOARD: {
    READ:                   "dashboard.read",               // access dashboard at all

    // ── Summary cards ─────────────────────────────────────────────────────────
    VIEW_REVENUE_STATS:     "dashboard.view_revenue_stats",     // total revenue, today, MTD, YTD
    VIEW_ORDER_STATS:       "dashboard.view_order_stats",       // total / pending / processing counts
    VIEW_PRODUCT_STATS:     "dashboard.view_product_stats",     // total / low-stock / out-of-stock
    VIEW_CUSTOMER_STATS:    "dashboard.view_customer_stats",    // new customers, total customers
    VIEW_STORE_STATS:       "dashboard.view_store_stats",       // active stores (superadmin only)
    VIEW_SELLER_STATS:      "dashboard.view_seller_stats",      // seller-specific summary

    // ── Charts ────────────────────────────────────────────────────────────────
    VIEW_SALES_CHART:       "dashboard.view_sales_chart",       // revenue over time (line/bar)
    VIEW_ORDER_CHART:       "dashboard.view_order_chart",       // orders over time
    VIEW_TRAFFIC_CHART:     "dashboard.view_traffic_chart",     // visits / page views
    VIEW_CATEGORY_CHART:    "dashboard.view_category_chart",    // sales by category (pie/donut)
    VIEW_TOP_PRODUCTS:      "dashboard.view_top_products",      // best-selling products widget
    VIEW_TOP_CUSTOMERS:     "dashboard.view_top_customers",     // top spenders widget
    VIEW_TOP_STORES:        "dashboard.view_top_stores",        // top stores (superadmin only)

    // ── Live / Activity feeds ─────────────────────────────────────────────────
    VIEW_RECENT_ORDERS:     "dashboard.view_recent_orders",     // latest orders table
    VIEW_RECENT_REVIEWS:    "dashboard.view_recent_reviews",    // latest reviews feed
    VIEW_LOW_STOCK_ALERTS:  "dashboard.view_low_stock_alerts",  // products needing restock
    VIEW_PENDING_APPROVALS: "dashboard.view_pending_approvals", // stores/reviews awaiting action
    VIEW_ACTIVITY_FEED:     "dashboard.view_activity_feed",     // audit-style recent actions
  },

  // ── Analytics ──────────────────────────────────────────────────────────────
  ANALYTICS: {
    READ:             "analytics.read",

    // ── Revenue ───────────────────────────────────────────────────────────────
    READ_REVENUE:           "analytics.read_revenue",           // total revenue reports
    READ_REVENUE_BY_STORE:  "analytics.read_revenue_by_store",  // per-store breakdown
    READ_REVENUE_BY_PERIOD: "analytics.read_revenue_by_period", // daily / weekly / monthly

    // ── Orders ────────────────────────────────────────────────────────────────
    READ_ORDERS:            "analytics.read_orders",
    READ_ORDER_FUNNEL:      "analytics.read_order_funnel",      // placed → confirmed → delivered
    READ_CANCELLATION_RATE: "analytics.read_cancellation_rate",
    READ_RETURN_RATE:       "analytics.read_return_rate",

    // ── Products ──────────────────────────────────────────────────────────────
    READ_PRODUCTS:          "analytics.read_products",
    READ_TOP_SELLING:       "analytics.read_top_selling",       // best sellers by qty / revenue
    READ_LOW_STOCK:         "analytics.read_low_stock",         // inventory health
    READ_PRODUCT_VIEWS:     "analytics.read_product_views",     // impressions & CTR

    // ── Customers ─────────────────────────────────────────────────────────────
    READ_CUSTOMERS:         "analytics.read_customers",
    READ_NEW_VS_RETURNING:  "analytics.read_new_vs_returning",
    READ_CUSTOMER_LTV:      "analytics.read_customer_ltv",      // lifetime value

    // ── Store ─────────────────────────────────────────────────────────────────
    READ_STORE:             "analytics.read_store",             // own store analytics
    READ_ALL_STORES:        "analytics.read_all_stores",        // platform-wide (superadmin)

    // ── Coupons ───────────────────────────────────────────────────────────────
    READ_COUPON_USAGE:      "analytics.read_coupon_usage",      // redemptions & discount impact

    // ── Export ────────────────────────────────────────────────────────────────
    EXPORT:                 "analytics.export",
  },

  // ── Notification ───────────────────────────────────────────────────────────
  NOTIFICATION: {
    READ:        "notification.read",
    READ_ALL:    "notification.read_all",
    SEND:        "notification.send",
    DELETE:      "notification.delete",
    MARK_READ:   "notification.mark_read",
  },

  // ── Audit Log ──────────────────────────────────────────────────────────────
  AUDIT: {
    READ:     "audit.read",
    READ_ALL: "audit.read_all",
    EXPORT:   "audit.export",
    PURGE:    "audit.purge",
  },

  // ── Settings ───────────────────────────────────────────────────────────────
  SETTINGS: {
    READ:                    "settings.read",
    UPDATE:                  "settings.update",
    MANAGE_PAYMENT_GATEWAYS: "settings.manage_payment_gateways",
    MANAGE_SHIPPING:         "settings.manage_shipping",
    MANAGE_TAX:              "settings.manage_tax",
    MANAGE_NOTIFICATIONS:    "settings.manage_notifications",
    TOGGLE_MAINTENANCE:      "settings.toggle_maintenance",
  },
};

/**
 * Flat array of every permission key in the system.
 * Useful for validation schemas, dropdowns, and DB seeding.
 *
 * e.g. ALL_PERMISSIONS[0] → "auth.login"
 */
export const ALL_PERMISSIONS = Object.values(PERMISSIONS).flatMap((group) =>
  Object.values(group)
);

/**
 * Permission groups keyed by role — used in seedRoles.js to assign
 * the right subset to each system role without listing every key manually.
 *
 * SUPERADMIN → all permissions (ALL_PERMISSIONS)
 * ADMIN      → everything except AUDIT.PURGE and SETTINGS system-level keys
 * SELLER     → only their own store scope
 */
export const ROLE_PERMISSION_MAP = {
  // Superadmin gets every permission — handled in seedRoles.js via ALL_PERMISSIONS

  admin: [
    // Auth
    PERMISSIONS.AUTH.LOGIN, PERMISSIONS.AUTH.LOGOUT,
    PERMISSIONS.AUTH.REFRESH_TOKEN, PERMISSIONS.AUTH.CHANGE_PASSWORD,

    // User management
    PERMISSIONS.USER.CREATE, PERMISSIONS.USER.READ, PERMISSIONS.USER.READ_ALL,
    PERMISSIONS.USER.UPDATE, PERMISSIONS.USER.DELETE,
    PERMISSIONS.USER.ACTIVATE, PERMISSIONS.USER.DEACTIVATE,
    PERMISSIONS.USER.CHANGE_ROLE, PERMISSIONS.USER.RESET_PASSWORD,
    PERMISSIONS.USER.EXPORT,

    // Store
    PERMISSIONS.STORE.CREATE, PERMISSIONS.STORE.READ, PERMISSIONS.STORE.READ_ALL,
    PERMISSIONS.STORE.UPDATE, PERMISSIONS.STORE.DELETE,
    PERMISSIONS.STORE.ACTIVATE, PERMISSIONS.STORE.DEACTIVATE,
    PERMISSIONS.STORE.VERIFY, PERMISSIONS.STORE.EXPORT,

    // Product — full
    ...Object.values(PERMISSIONS.PRODUCT),

    // Category & Brand — full
    ...Object.values(PERMISSIONS.CATEGORY),
    ...Object.values(PERMISSIONS.BRAND),

    // Order — full
    ...Object.values(PERMISSIONS.ORDER),

    // Coupon — full
    ...Object.values(PERMISSIONS.COUPON),

    // Review — full
    ...Object.values(PERMISSIONS.REVIEW),

    // Banner — full
    ...Object.values(PERMISSIONS.BANNER),

    // Customer — full
    ...Object.values(PERMISSIONS.CUSTOMER),

    // Dashboard — all widgets
    ...Object.values(PERMISSIONS.DASHBOARD),

    // Analytics — all except READ_ALL_STORES (superadmin only)
    ...Object.values(PERMISSIONS.ANALYTICS).filter(
      (p) => p !== PERMISSIONS.ANALYTICS.READ_ALL_STORES
    ),

    // Notification
    ...Object.values(PERMISSIONS.NOTIFICATION),

    // Audit — read & export only, no purge
    PERMISSIONS.AUDIT.READ, PERMISSIONS.AUDIT.READ_ALL, PERMISSIONS.AUDIT.EXPORT,

    // Settings — read & standard updates, no maintenance toggle
    PERMISSIONS.SETTINGS.READ, PERMISSIONS.SETTINGS.UPDATE,
    PERMISSIONS.SETTINGS.MANAGE_PAYMENT_GATEWAYS,
    PERMISSIONS.SETTINGS.MANAGE_SHIPPING, PERMISSIONS.SETTINGS.MANAGE_TAX,
    PERMISSIONS.SETTINGS.MANAGE_NOTIFICATIONS,
  ],

  seller: [
    // Auth
    PERMISSIONS.AUTH.LOGIN, PERMISSIONS.AUTH.LOGOUT,
    PERMISSIONS.AUTH.REFRESH_TOKEN, PERMISSIONS.AUTH.CHANGE_PASSWORD,

    // Own store only
    PERMISSIONS.STORE.READ, PERMISSIONS.STORE.UPDATE,

    // Product — own store, no bulk delete or import
    PERMISSIONS.PRODUCT.CREATE, PERMISSIONS.PRODUCT.READ,
    PERMISSIONS.PRODUCT.READ_ALL, PERMISSIONS.PRODUCT.UPDATE,
    PERMISSIONS.PRODUCT.PUBLISH, PERMISSIONS.PRODUCT.UNPUBLISH,
    PERMISSIONS.PRODUCT.MANAGE_VARIANTS, PERMISSIONS.PRODUCT.MANAGE_INVENTORY,
    PERMISSIONS.PRODUCT.MANAGE_IMAGES, PERMISSIONS.PRODUCT.MANAGE_PRICING,
    PERMISSIONS.PRODUCT.BULK_UPDATE, PERMISSIONS.PRODUCT.EXPORT,
    PERMISSIONS.PRODUCT.VIEW_ANALYTICS,

    // Category & Brand — read only
    PERMISSIONS.CATEGORY.READ, PERMISSIONS.CATEGORY.READ_ALL,
    PERMISSIONS.BRAND.READ, PERMISSIONS.BRAND.READ_ALL,

    // Order — own store orders, no refund or assign
    PERMISSIONS.ORDER.READ, PERMISSIONS.ORDER.READ_ALL,
    PERMISSIONS.ORDER.UPDATE_STATUS, PERMISSIONS.ORDER.CANCEL,
    PERMISSIONS.ORDER.APPROVE_RETURN, PERMISSIONS.ORDER.REJECT_RETURN,
    PERMISSIONS.ORDER.GENERATE_INVOICE,
    PERMISSIONS.ORDER.GENERATE_SHIPPING_LABEL,
    PERMISSIONS.ORDER.ADD_NOTE, PERMISSIONS.ORDER.EXPORT,
    PERMISSIONS.ORDER.BULK_UPDATE_STATUS,

    // Coupon — own store
    PERMISSIONS.COUPON.CREATE, PERMISSIONS.COUPON.READ,
    PERMISSIONS.COUPON.READ_ALL, PERMISSIONS.COUPON.UPDATE,
    PERMISSIONS.COUPON.ACTIVATE, PERMISSIONS.COUPON.DEACTIVATE,
    PERMISSIONS.COUPON.EXPORT,

    // Review — moderate own store reviews
    PERMISSIONS.REVIEW.READ, PERMISSIONS.REVIEW.READ_ALL,
    PERMISSIONS.REVIEW.APPROVE, PERMISSIONS.REVIEW.REJECT,
    PERMISSIONS.REVIEW.REPLY,

    // Banner — own store
    PERMISSIONS.BANNER.CREATE, PERMISSIONS.BANNER.READ,
    PERMISSIONS.BANNER.READ_ALL, PERMISSIONS.BANNER.UPDATE,
    PERMISSIONS.BANNER.DELETE, PERMISSIONS.BANNER.ACTIVATE,
    PERMISSIONS.BANNER.DEACTIVATE, PERMISSIONS.BANNER.REORDER,

    // Customer — view only
    PERMISSIONS.CUSTOMER.READ, PERMISSIONS.CUSTOMER.VIEW_ORDERS,

    // Dashboard — seller-scoped widgets only
    PERMISSIONS.DASHBOARD.READ,
    PERMISSIONS.DASHBOARD.VIEW_REVENUE_STATS,
    PERMISSIONS.DASHBOARD.VIEW_ORDER_STATS,
    PERMISSIONS.DASHBOARD.VIEW_PRODUCT_STATS,
    PERMISSIONS.DASHBOARD.VIEW_SELLER_STATS,
    PERMISSIONS.DASHBOARD.VIEW_SALES_CHART,
    PERMISSIONS.DASHBOARD.VIEW_ORDER_CHART,
    PERMISSIONS.DASHBOARD.VIEW_TOP_PRODUCTS,
    PERMISSIONS.DASHBOARD.VIEW_RECENT_ORDERS,
    PERMISSIONS.DASHBOARD.VIEW_RECENT_REVIEWS,
    PERMISSIONS.DASHBOARD.VIEW_LOW_STOCK_ALERTS,

    // Analytics — own store only
    PERMISSIONS.ANALYTICS.READ,
    PERMISSIONS.ANALYTICS.READ_REVENUE,
    PERMISSIONS.ANALYTICS.READ_REVENUE_BY_PERIOD,
    PERMISSIONS.ANALYTICS.READ_ORDERS,
    PERMISSIONS.ANALYTICS.READ_CANCELLATION_RATE,
    PERMISSIONS.ANALYTICS.READ_RETURN_RATE,
    PERMISSIONS.ANALYTICS.READ_PRODUCTS,
    PERMISSIONS.ANALYTICS.READ_TOP_SELLING,
    PERMISSIONS.ANALYTICS.READ_LOW_STOCK,
    PERMISSIONS.ANALYTICS.READ_PRODUCT_VIEWS,
    PERMISSIONS.ANALYTICS.READ_CUSTOMERS,
    PERMISSIONS.ANALYTICS.READ_NEW_VS_RETURNING,
    PERMISSIONS.ANALYTICS.READ_COUPON_USAGE,
    PERMISSIONS.ANALYTICS.READ_STORE,
    PERMISSIONS.ANALYTICS.EXPORT,

    // Notification — own
    PERMISSIONS.NOTIFICATION.READ, PERMISSIONS.NOTIFICATION.MARK_READ,

    // Settings — own store settings only
    PERMISSIONS.SETTINGS.READ, PERMISSIONS.SETTINGS.UPDATE,
    PERMISSIONS.SETTINGS.MANAGE_SHIPPING,
    PERMISSIONS.SETTINGS.MANAGE_NOTIFICATIONS,
  ],
};