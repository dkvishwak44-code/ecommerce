/**
 * src/api/admin/routes.js
 *
 * Central barrel for ALL admin API versions.
 * Mount pattern: /api/admin/v1/...
 */

import express from "express";
import v1 from "./v1/index.js";

const adminRoutes = express.Router();

adminRoutes.use("/v1", v1);

export default adminRoutes; 