// /**
//  * Client Coupon Routes
//  * Base: /api/client/v1/coupons
//  *
//  * Customers can validate a coupon code before applying it.
//  * Actual application happens via cart.routes.js POST /cart/coupon.
//  */

// import { Router } from "express";
// import { validateCoupon } from "../../../modules/coupon/coupon.controller.js";
// import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
// import { validate }             from "../../../middleware/validate.middleware.js";
// import { validateCouponSchema } from "../../../modules/coupon/coupon.validation.js";

// const router = Router();

// // POST /api/client/v1/coupons/validate
// // Check if a code is valid for the customer's cart value before showing the discount
// router.post(
//   "/validate",
//   customerAuthenticate,
//   validate(validateCouponSchema),
//   validateCoupon
// );

// export default router;