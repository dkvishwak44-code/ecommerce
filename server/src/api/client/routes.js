/**
 * src/api/client/routes.js
 *
 * Central barrel for ALL client API versions.
 * Mount pattern: /api/client/v1/...
 */

import express from "express";
import v1 from "./v1/index.js";

const clientRoutes = express.Router();

clientRoutes.use("/v1", v1);  //  correct variable name

export default clientRoutes;