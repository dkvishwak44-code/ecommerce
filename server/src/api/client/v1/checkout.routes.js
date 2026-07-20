/**
 * Client Checkout Routes
 * Base: /api/client/v1/checkout
 */

import { Router } from "express";
import {
  getCheckoutSummary,
  initiateCheckout,
  verifyPayment,
  getOrderConfirmation,
} from "../../../modules/order/client/checkout.controller.js";
import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  initiateCheckoutSchema,
  verifyPaymentSchema,
} from "../../../modules/order/order.validation.js";

const router = Router();

router.use(customerAuthenticate);

router.get("/summary", getCheckoutSummary);
router.post("/initiate", validate(initiateCheckoutSchema), initiateCheckout);
router.post("/verify", validate(verifyPaymentSchema), verifyPayment);
router.get("/confirmation/:orderId", getOrderConfirmation);

export default router;
