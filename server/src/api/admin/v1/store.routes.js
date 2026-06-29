import { Router } from "express";
import {
  createStoreByAdmin,
  deleteStore,
  getStoreById,
  listAllStores,
  rejectStore,
  toggleStoreActive,
  updateStoreByAdmin,
  verifyStore,
} from "../../../modules/store/store.controller.js";
import {
  authenticate,
  checkPermission,
  restrictTo,
} from "../../../middleware/auth.middleware.js";
import { PERMISSIONS } from "../../../constants/permissions.js";

const router = Router();

router.use(authenticate, restrictTo("superadmin", "admin"));

router.get(
  "/",
  checkPermission(PERMISSIONS.STORE.READ_ALL),
  listAllStores
);

router.post(
  "/",
  restrictTo("superadmin"),
  checkPermission(PERMISSIONS.STORE.CREATE),
  createStoreByAdmin
);

router.get(
  "/:id",
  checkPermission(PERMISSIONS.STORE.READ),
  getStoreById
);

router.patch(
  "/:id",
  checkPermission(PERMISSIONS.STORE.UPDATE),
  updateStoreByAdmin
);

router.delete(
  "/:id",
  checkPermission(PERMISSIONS.STORE.DELETE),
  deleteStore
);

router.patch(
  "/:id/verify",
  checkPermission(PERMISSIONS.STORE.VERIFY),
  verifyStore
);

router.patch(
  "/:id/reject",
  checkPermission(PERMISSIONS.STORE.VERIFY),
  rejectStore
);

router.patch(
  "/:id/toggle-active",
  checkPermission(PERMISSIONS.STORE.ACTIVATE),
  toggleStoreActive
);

export default router;
