// /**
//  * Client Order Routes
//  * Base: /api/client/v1/orders
//  *
//  * Customer viewing and managing their own orders.
//  * All routes require login.
//  */

// import { Router } from "express";
// import {
//   getOrders,
//   getOrder,
//   cancelOrder,
//   requestReturn,
//   downloadInvoice,
//   trackOrder,
// } from "../../../modules/order/client/order.controller.js";

// import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
// import { validate }             from "../../../middleware/validate.middleware.js";
// import {
//   cancelOrderSchema,
//   returnRequestSchema,
// } from "../../../modules/order/order.validation.js";

// const router = Router();

// router.use(customerAuthenticate);

// router.get("/",                              getOrders);         // paginated order history
// router.get("/:id",                           getOrder);          // order detail
// router.get("/:id/track",                     trackOrder);        // live status + timeline
// router.get("/:id/invoice",                   downloadInvoice);   // PDF invoice download
// router.post("/:id/cancel",   validate(cancelOrderSchema),   cancelOrder);
// router.post("/:id/return",   validate(returnRequestSchema), requestReturn);

// export default router;