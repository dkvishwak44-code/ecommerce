// /**
//  * Client Checkout Routes
//  * Base: /api/client/v1/checkout
//  *
//  * All routes require login.
//  * Flow: summary → initiate → verify payment → confirmation
//  */

// import { Router } from "express";
// import {
//   getCheckoutSummary,
//   initiateCheckout,
//   verifyPayment,
//   getOrderConfirmation,
// } from "../../../modules/order/client/checkout.controller.js";

// import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
// import { validate }             from "../../../middleware/validate.middleware.js";
// import {
//   initiateCheckoutSchema,
//   verifyPaymentSchema,
// } from "../../../modules/order/order.validation.js";

// const router = Router();

// router.use(customerAuthenticate);

// // Step 1 — preview (cart + shipping + tax + coupon totals)
// router.get("/summary",                              getCheckoutSummary);

// // Step 2 — create order & get payment gateway order_id
// router.post("/initiate",  validate(initiateCheckoutSchema),  initiateCheckout);

// // Step 3 — gateway callback: verify signature & mark order paid
// router.post("/verify",    validate(verifyPaymentSchema),     verifyPayment);

// // Step 4 — confirmation page data
// router.get("/confirmation/:orderId",                getOrderConfirmation);

// export default router;