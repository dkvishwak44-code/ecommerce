/**
 * src/api/admin/v1/index.js
 *
 * Registers every admin v1 route module under /api/admin/v1/...
 * All protected routes enforce JWT + role guards inside their own route files.
 */

import express          from "express";
import authRoutes        from "./auth.routes.js";
import userRoutes        from "./user.routes.js";
// import roleRoutes        from "./role.routes.js";
// import permissionRoutes  from "./permission.routes.js";
// import storeRoutes       from "./store.routes.js";
import productRoutes     from "./product.routes.js";
// import categoryRoutes    from "./category.routes.js";
// import brandRoutes       from "./brand.routes.js";
// import bannerRoutes      from "./banner.routes.js";
// import orderRoutes       from "./order.routes.js";
// import customerRoutes    from "./customer.routes.js";
// import couponRoutes      from "./coupon.routes.js";
// import reviewRoutes      from "./review.routes.js";
// import dashboardRoutes   from "./dashboard.routes.js";
// import analyticsRoutes   from "./analytics.routes.js";
// import notificationRoutes from "./notification.routes.js";
// import settingsRoutes    from "./settings.routes.js";
// import auditRoutes       from "./audit.routes.js";

const router = express.Router();

// ── Mount ─────────────────────────────────────────────────────────────────────
router.use("/auth",          authRoutes);
router.use("/users",         userRoutes);
// router.use("/roles",         roleRoutes);
// router.use("/permissions",   permissionRoutes);
// router.use("/stores",        storeRoutes);
// router.use("/products",productRoutes);
// router.use("/categories",    categoryRoutes);
// router.use("/brands",        brandRoutes);
// router.use("/banners",       bannerRoutes);
// router.use("/orders",        orderRoutes);
// router.use("/customers",     customerRoutes);
// router.use("/coupons",       couponRoutes);
// router.use("/reviews",       reviewRoutes);
// router.use("/dashboard",     dashboardRoutes);
// router.use("/analytics",     analyticsRoutes);
// router.use("/notifications", notificationRoutes);
// router.use("/settings",      settingsRoutes);
// router.use("/audit",         auditRoutes);

export default router; // 