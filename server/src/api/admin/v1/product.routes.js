/**
 * Admin Product Routes
 * Base: /api/admin/v1/products
 *
 * Mounted in: src/api/admin/routes.js
 *
 * Auth wall  : authenticate  — valid JWT required
 * First-login: protectFirstLogin — redirect if mustResetPassword
 * Permission : checkPermission(PERMISSIONS.PRODUCT.*)
 * Ownership  : storeScope    — sellers only see their own store's products
 * Audit      : auditLog      — writes to audit collection on mutations
 */

import { Router } from "express";
import {
getAllProducts,
 getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  // bulkDeleteProducts,
  // bulkUpdateProducts,
  // publishProduct,
  // unpublishProduct,
  // updateInventory,
  // updatePricing,
  // uploadProductImages,
  // deleteProductImage,
  // reorderProductImages,
  // getProductAnalytics,
  // importProducts,
  // exportProducts,
} from "../../../modules/product/admin/product.controller.js";

import { authenticate }    from "../../../middleware/auth.middleware.js";
import { protectFirstLogin } from "../../../middleware/auth.middleware.js";
import { checkPermission }       from "../../../middleware/permission.middleware.js";
import { storeScope }      from "../../../middleware/ownership.middleware.js";
// import { auditLog }        from "../../../middleware/audit.middleware.js";

// import { uploadImages }    from "../../../middleware/upload.middleware.js";
import { validate }        from "../../../middleware/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  // updateInventorySchema,
  // updatePricingSchema,
  // bulkDeleteSchema,
  // bulkUpdateSchema,
  // importProductSchema,
} from "../../../modules/product/product.validation.js";
import { PERMISSIONS }     from "../../../constants/permissions.js";

const router = Router();

// ── All product admin routes require a valid JWT + first-login check ──────────
router.use(authenticate, protectFirstLogin);

// ── List & Search ─────────────────────────────────────────────────────────────
router.get(
  "/",
  checkPermission(PERMISSIONS.PRODUCT.READ_ALL),
  storeScope,          // sellers: auto-filter to their store; admins: see all
  getAllProducts
);

// ── Single Product ────────────────────────────────────────────────────────────
router.get(
  "/:id",
  checkPermission(PERMISSIONS.PRODUCT.READ),
  storeScope,
  getProductById
);

// ── Create ────────────────────────────────────────────────────────────────────
router.post(
  "/",
  checkPermission(PERMISSIONS.PRODUCT.CREATE),
  validate(createProductSchema),
  // auditLog("product.create"),
  createProduct
);

// ── Update ────────────────────────────────────────────────────────────────────
router.patch(
  "/:id",
  checkPermission(PERMISSIONS.PRODUCT.UPDATE),
  storeScope,
  validate(updateProductSchema),
  // auditLog("product.update"),
  updateProduct
);

// ── Delete ────────────────────────────────────────────────────────────────────
router.delete(
  "/:id",
  checkPermission(PERMISSIONS.PRODUCT.DELETE),
  storeScope,
  // auditLog("product.delete"),
  deleteProduct
);

// ── Publish / Unpublish ───────────────────────────────────────────────────────
// router.patch(
//   "/:id/publish",
//   checkPermission(PERMISSIONS.PRODUCT.PUBLISH),
//   storeScope,
//   // auditLog("product.publish"),
//   publishProduct
// );

// router.patch(
//   "/:id/unpublish",
//   checkPermission(PERMISSIONS.PRODUCT.UNPUBLISH),
//   storeScope,
//   // auditLog("product.unpublish"),
//   unpublishProduct
// );

// ── Inventory ─────────────────────────────────────────────────────────────────
// router.patch(
//   "/:id/inventory",
//   checkPermission(PERMISSIONS.PRODUCT.MANAGE_INVENTORY),
//   storeScope,
//   validate(updateInventorySchema),
//   // auditLog("product.update_inventory"),
//   updateInventory
// );

// // ── Pricing ───────────────────────────────────────────────────────────────────
// router.patch(
//   "/:id/pricing",
//   checkPermission(PERMISSIONS.PRODUCT.MANAGE_PRICING),
//   storeScope,
//   validate(updatePricingSchema),
//   // auditLog("product.update_pricing"),
//   updatePricing
// );

// ── Images ────────────────────────────────────────────────────────────────────
// router.post(
//   "/:id/images",
//   checkPermission(PERMISSIONS.PRODUCT.MANAGE_IMAGES),
//   storeScope,
//   uploadImages("products", 8),   // multer — max 8 images, stored under uploads/products/
//   // auditLog("product.upload_images"),
//   uploadProductImages
// );

// router.delete(
//   "/:id/images/:imageId",
//   checkPermission(PERMISSIONS.PRODUCT.MANAGE_IMAGES),
//   storeScope,
//   // auditLog("product.delete_image"),
//   deleteProductImage
// );

// router.patch(
//   "/:id/images/reorder",
//   checkPermission(PERMISSIONS.PRODUCT.MANAGE_IMAGES),
//   storeScope,
//   reorderProductImages
// );

// ── Analytics (per product) ───────────────────────────────────────────────────
// router.get(
//   "/:id/analytics",
//   checkPermission(PERMISSIONS.PRODUCT.VIEW_ANALYTICS),
//   storeScope,
//   getProductAnalytics
// );

// ── Bulk Operations ───────────────────────────────────────────────────────────
// router.post(
//   "/bulk-delete",
//   checkPermission(PERMISSIONS.PRODUCT.BULK_DELETE),
//   storeScope,
//   validate(bulkDeleteSchema),
//   // auditLog("product.bulk_delete"),
//   // bulkDeleteProducts
// );

// router.patch(
//   "/bulk-update",
//   checkPermission(PERMISSIONS.PRODUCT.BULK_UPDATE),
//   storeScope,
//   validate(bulkUpdateSchema),
//   // auditLog("product.bulk_update"),
//   bulkUpdateProducts
// );

// ── Import / Export ───────────────────────────────────────────────────────────
// router.post(
//   "/import",
//   checkPermission(PERMISSIONS.PRODUCT.IMPORT),
//   uploadImages("temp", 1),       // reuse upload middleware for single CSV/XLSX file
//   validate(importProductSchema),
//   // auditLog("product.import"),
//   importProducts
// );

// router.get(
//   "/export",
//   checkPermission(PERMISSIONS.PRODUCT.EXPORT),
//   storeScope,
//   exportProducts
// );

export default router;