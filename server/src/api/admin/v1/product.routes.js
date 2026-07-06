import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../../../modules/product/admin/product.controller.js";
import {
  authenticate,
  checkPermission,
  restrictTo,
} from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../../../modules/product/product.validation.js";
import { PERMISSIONS } from "../../../constants/permissions.js";
import { uploadProductImages } from "../../../config/multer.js";

const router = Router();

router.use(authenticate, restrictTo("superadmin", "admin", "seller"));

router.get(
  "/",
  checkPermission(PERMISSIONS.PRODUCT.READ_ALL),
  getAllProducts
);

router.post(
  "/",
  checkPermission(PERMISSIONS.PRODUCT.CREATE),
  // validate(createProductSchema),
   uploadProductImages,
  createProduct
);

router.get(
  "/:id",
  checkPermission(PERMISSIONS.PRODUCT.READ),
  getProductById
);

router.patch(
  "/:id",
  checkPermission(PERMISSIONS.PRODUCT.UPDATE),
  // validate(updateProductSchema),
   uploadProductImages,
  updateProduct
);

router.delete(
  "/:id",
  checkPermission(PERMISSIONS.PRODUCT.DELETE),
  deleteProduct
);

export default router;
