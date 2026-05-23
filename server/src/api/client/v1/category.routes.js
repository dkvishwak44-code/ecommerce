// /**
//  * Client Category Routes
//  * Base: /api/client/v1/categories
//  *
//  * All public — no auth needed.
//  */

// import { Router } from "express";
// import {
//   getCategories,
//   getCategory,
//   getCategoryTree,
// } from "../../../modules/category/client/category.controller.js";

// const router = Router();

// router.get("/",           getCategories);     // flat list with pagination
// router.get("/tree",       getCategoryTree);   // nested parent → children tree (for nav menu)
// router.get("/:slug",      getCategory);       // single category with sub-categories

// export default router;