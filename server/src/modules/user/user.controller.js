// modules/user/user.controller.js  (admin)

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess }  from "../../utils/response.js";
import {
  createUserByAdmin,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  resetUserPasswordByAdmin,
} from "./user.service.js";

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone, roleId, roleName, storeId } = req.body;
  const result = await createUserByAdmin({
    name,
    email,
    phone,
    roleId,
    roleName,
    storeId,
    createdBy: req.user.id,
  });
  return sendSuccess(res, {message: result.message,result,statusCode:201});
});

export const getAllUsers = asyncHandler(async (req, res) => {
  console.log("req body :",req.body);
   const requester = {
      roleName: req.user.roleName, // ya req.user.roleName, jo bhi tumhare JWT payload mein hai
      storeId: req?.query?. storeId, // req.user.storeId
    };
  const result = await getUsers(req.query, requester);
  console.log("result :",result);
  return sendSuccess(res, {message:"Users fetched successfully",result,statusCode:200 });
});

export const getUser = asyncHandler(async (req, res) => {
  const result = await getUserById(req.params.id);
  return sendSuccess(res, result, "User fetched successfully", 200);
});

export const updateUserById = asyncHandler(async (req, res) => {
  const result = await updateUser(req.params.id, req.body, req.user.id);
  return sendSuccess(res, result, result.message, 200);
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const result = await deleteUser(req.params.id, req.user.id);
  return sendSuccess(res, null, result.message, 200);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await resetUserPasswordByAdmin(req.params.id, req.user.id);
  return sendSuccess(res, null, result.message, 200);
});