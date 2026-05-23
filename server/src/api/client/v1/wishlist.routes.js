// /**
//  * Client Wishlist Routes
//  * Base: /api/client/v1/wishlist
//  *
//  * All routes require login.
//  */

// import { Router } from "express";
// import {
//   getWishlist,
//   addToWishlist,
//   removeFromWishlist,
//   clearWishlist,
//   moveToCart,
// } from "../../../modules/wishlist/wishlist.controller.js";

// import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";

// const router = Router();

// router.use(customerAuthenticate);

// router.get("/",                    getWishlist);
// router.post("/:productId",         addToWishlist);
// router.delete("/:productId",       removeFromWishlist);
// router.delete("/",                 clearWishlist);
// router.post("/:productId/move-to-cart", moveToCart);   // add to cart + remove from wishlist

// export default router;