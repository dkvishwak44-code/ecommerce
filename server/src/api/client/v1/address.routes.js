/**
 * Client Address Routes
 * Base: /api/client/v1/addresses
 *
 * Customer managing their saved delivery addresses.
 */

import { Router } from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../../modules/customer/customer.controller.js";

import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
import { validate }             from "../../../middleware/validate.middleware.js";
import { addressSchema }        from "../../../modules/customer/customer.validation.js";

const router = Router();

router.use(customerAuthenticate);

router.get("/",                  getAddresses);
router.post("/",                 validate(addressSchema),   addAddress);
router.patch("/:addressId",      validate(addressSchema),   updateAddress);
router.delete("/:addressId",                               deleteAddress);
router.patch("/:addressId/default",                        setDefaultAddress);

export default router;