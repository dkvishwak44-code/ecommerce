/**
 * Client Order Routes
 * Base: /api/client/v1/orders
 */

import { Router } from "express";
import {
  getOrders,
  getOrder,
  cancelOrder,
  requestReturn,
  downloadInvoice,
  trackOrder,
} from "../../../modules/order/client/order.controller.js";
import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  cancelOrderSchema,
  returnRequestSchema,
} from "../../../modules/order/order.validation.js";

const router = Router();

router.use(customerAuthenticate);

router.get("/", getOrders);
router.get("/:id", getOrder);
router.get("/:id/track", trackOrder);
router.get("/:id/invoice", downloadInvoice);
router.post("/:id/cancel", validate(cancelOrderSchema), cancelOrder);
router.post("/:id/return", validate(returnRequestSchema), requestReturn);

export default router;
