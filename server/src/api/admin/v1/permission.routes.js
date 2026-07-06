import { Router } from "express";
import permissionRoutes from "../../../modules/permission/admin/permission.routes.js";

const router = Router();

router.use("/", permissionRoutes);

export default router;
