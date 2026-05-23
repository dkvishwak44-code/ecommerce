// /**
//  * Client Customer Routes
//  * Base: /api/client/v1/customer
//  *
//  * Logged-in customer managing their own profile.
//  * All routes require customerAuthenticate.
//  */

// import { Router } from "express";
// import {
//   getProfile,
//   updateProfile,
//   uploadAvatar,
//   deleteAvatar,
//   deleteAccount,
// } from "../../../modules/customer/customer.controller.js";

// import { customerAuthenticate } from "../../../middleware/customerAuth.middleware.js";
// import { uploadSingle }         from "../../../middleware/upload.middleware.js";
// import { validate }             from "../../../middleware/validate.middleware.js";
// import { updateProfileSchema }  from "../../../modules/customer/customer.validation.js";

// const router = Router();

// router.use(customerAuthenticate);

// router.get("/profile",        getProfile);
// router.patch("/profile",      validate(updateProfileSchema), updateProfile);
// router.post("/avatar",        uploadSingle("users", "avatar"), uploadAvatar);
// router.delete("/avatar",      deleteAvatar);
// router.delete("/account",     deleteAccount);   // soft-delete own account

// export default router;