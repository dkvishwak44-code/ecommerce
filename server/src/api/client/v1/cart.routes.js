// /**
//  * Client Cart Routes
//  * Base: /api/client/v1/cart
//  *
//  * All routes require login — cart is tied to customer session.
//  */

// import { Router } from "express";
// import {
//   getCart,
//   addToCart,
//   updateCartItem,
//   removeCartItem,
//   clearCart,
//   applyCoupon,
//   removeCoupon,
// } from "../../../modules/cart/cart.controller.js";

// import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
// import { validate }             from "../../../middleware/validate.middleware.js";
// import {
//   addToCartSchema,
//   updateCartItemSchema,
//   applyCouponSchema,
// } from "../../../modules/cart/cart.validation.js";

// const router = Router();

// router.use(customerAuthenticate);

// router.get("/",                           getCart);
// router.post("/items",        validate(addToCartSchema),        addToCart);
// router.patch("/items/:itemId", validate(updateCartItemSchema), updateCartItem);
// router.delete("/items/:itemId",           removeCartItem);
// router.delete("/",                        clearCart);

// // ── Coupon ────────────────────────────────────────────────────────────────────
// router.post("/coupon",       validate(applyCouponSchema),      applyCoupon);
// router.delete("/coupon",                                       removeCoupon);

// export default router;