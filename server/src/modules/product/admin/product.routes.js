// modules/product/admin/product.routes.js

import express from "express";
import * as controller from "./product.controller.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { checkPermission } from "../../../middleware/permission.middleware.js";
import { auth } from "../../../middleware/auth.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../product.validation.js";

const router = express.Router();

router.post(
  "/",

  auth,

  checkPermission("product.create"),

  validate(createProductSchema),

  controller.createProduct
);

router.get(
  "/",

  auth,

  checkPermission("product.view"),

  controller.getMyProducts
);

router.get(
  "/:id",

  auth,

  checkPermission("product.view"),

  controller.getProductById
);

router.put(
  "/:id",

  auth,

  checkPermission("product.update"),

  validate(updateProductSchema),

  controller.updateProduct
);

router.delete(
  "/:id",

  auth,

  checkPermission("product.delete"),

  controller.deleteProduct
);

export default router;