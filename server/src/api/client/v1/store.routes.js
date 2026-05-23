// /**
//  * Client Store Routes
//  * Base: /api/client/v1/stores
//  *
//  * Public storefront data — no auth required.
//  */

// import { Router } from "express";
// import {
//   getStores,
//   getStore,
//   getStoreProducts,
// } from "../../../modules/store/store.controller.js";

// const router = Router();

// router.get("/",               getStores);           // list all active verified stores
// router.get("/:slug",          getStore);            // store detail + meta
// router.get("/:slug/products", getStoreProducts);    // products belonging to this store

// export default router;