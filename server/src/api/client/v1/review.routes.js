// /**
//  * Client Review Routes
//  * Base: /api/client/v1/reviews
//  *
//  * Public: anyone can read reviews.
//  * Protected: only logged-in customers who purchased can write/edit/delete.
//  */

// import { Router } from "express";
// import {
//   getProductReviews,
//   createReview,
//   updateReview,
//   deleteReview,
// } from "../../../modules/review/review.controller.js";

// import { customerAuthenticate }         from "../../../middleware/customerAuth.middleware.js";
// import { optionalCustomerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
// import { validate }                     from "../../../middleware/validate.middleware.js";
// import {
//   createReviewSchema,
//   updateReviewSchema,
// } from "../../../modules/review/review.validation.js";

// const router = Router();

// // Public — read reviews for a product
// router.get("/product/:productId",    optionalCustomerAuthenticate, getProductReviews);

// // Protected
// router.post("/",        customerAuthenticate, validate(createReviewSchema), createReview);
// router.patch("/:id",    customerAuthenticate, validate(updateReviewSchema), updateReview);
// router.delete("/:id",   customerAuthenticate,                               deleteReview);

// export default router;