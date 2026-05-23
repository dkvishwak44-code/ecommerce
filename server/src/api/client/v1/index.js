/**
 * src/api/client/v1/index.js
 *
 * Registers every client-facing v1 route module under /api/client/v1/...
 */

import express from "express";
// import authRoutes     from "./auth.routes.js";
// import homeRoutes     from "./home.routes.js";
import productRoutes  from "./product.routes.js";
// import categoryRoutes from "./category.routes.js";
// import brandRoutes    from "./brand.routes.js";
// import storeRoutes    from "./store.routes.js";
// import cartRoutes     from "./cart.routes.js";
// import checkoutRoutes from "./checkout.routes.js";
// import orderRoutes    from "./order.routes.js";
// import addressRoutes  from "./address.routes.js";
// import wishlistRoutes from "./wishlist.routes.js";
// import reviewRoutes   from "./review.routes.js";
// import couponRoutes   from "./coupon.routes.js";
// import customerRoutes from "./customer.routes.js";

const router = express.Router();

// ── Mount ─────────────────────────────────────────────────────────────────────
// router.use("/auth",       authRoutes);
// router.use("/home",       homeRoutes);
router.use("/products",   productRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/brands",     brandRoutes);
// router.use("/stores",     storeRoutes);
// router.use("/cart",       cartRoutes);
// router.use("/checkout",   checkoutRoutes);
// router.use("/orders",     orderRoutes);
// router.use("/addresses",  addressRoutes);
// router.use("/wishlist",   wishlistRoutes);
// router.use("/reviews",    reviewRoutes);
// router.use("/coupons",    couponRoutes);
// router.use("/customers",  customerRoutes);

export default router; //  default export — matches "import v1 from ./v1/index.js"