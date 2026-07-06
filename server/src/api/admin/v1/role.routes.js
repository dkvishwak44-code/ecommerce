import { Router } from "express";
import roleRoutes from "../../../modules/role/admin/role.routes.js";

const router = Router();

router.use("/", roleRoutes);

export default router;
