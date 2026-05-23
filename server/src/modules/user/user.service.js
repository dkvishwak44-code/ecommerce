// modules/user/user.service.js  (admin — createUser)

import User from "./user.model.js";
import { AppError } from "../../utils/AppError.js";
import { logger } from "../../config/logger.js";
import { emitAuthEvent } from "../auth/auth.events.js";
import { userCreatedTemplate } from "../../utils/emailTemplates/userCreatedTemplate.js";

// ─── Create User By Admin ─────────────────────────────────────────────────────

/**
 * Creates a new user account on behalf of an admin/superadmin.
 *
 * Flow:
 *  1. Check duplicate email
 *  2. Resolve role ObjectId from roleName
 *  3. Call User.createByAdmin() — generates plain password + hashes it
 *  4. Send welcome email with temporary credentials
 *  5. Return sanitized user (no password)
 *
 * isFirstLogin is set to true automatically inside User.createByAdmin()
 * The plain password is emailed and then discarded — never stored.
 */
export const createUserByAdmin = async ({
  name,
  email,
  phone,
  roleId,
  roleName,
  storeId,
  createdBy,
}) => {
  // 1. Duplicate check
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError("A user with this email already exists.", 409);
  }

  // 2. Build fields
  const fields = {
    name,
    email,
    phone: phone ?? null,
    role: roleId,
    roleName: roleName,
    store: storeId ?? null,
    createdBy,
  };

  // 3. Create — password generated + hashed inside static method
  const { user, plainPassword } = await User.createByAdmin(fields);

  const template = userCreatedTemplate({
    name,
    email,
    password: plainPassword,
    loginUrl: "http://localhost:3000/login",
  });

  // 4. Send welcome email with temporary credentials
  try {
    const { sendEmail } = await import("../../utils/sendEmail.js");
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (err) {
    // Non-fatal — user is created; email failure just gets logged
    logger.error(
      `[createUserByAdmin] Failed to send welcome email to ${email}: ${err.message}`,
    );
  }

  emitAuthEvent("auth:admin_created_user", {
    userId: user._id,
    createdBy,
    roleName,
  });

  logger.info(
    `[createUserByAdmin] Created ${roleName} user: ${email} | isFirstLogin: true`,
  );

  return {
    message: `User created successfully. Login credentials have been sent to ${email}.`,
    user: _sanitize(user),
  };
};

// ─── Update User ──────────────────────────────────────────────────────────────

export const updateUser = async (userId, updates, updatedBy) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  const allowed = [
    "name",
    "phone",
    "role",
    "roleName",
    "store",
    "status",
    "avatar",
    "bio",
  ];
  allowed.forEach((key) => {
    if (updates[key] !== undefined) user[key] = updates[key];
  });

  await user.save();

  logger.info(`[updateUser] User ${userId} updated by ${updatedBy}`);
  return { message: "User updated successfully.", user: _sanitize(user) };
};

// ─── Delete User (Soft) ───────────────────────────────────────────────────────

export const deleteUser = async (userId, deletedBy) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  if (user.isSuperAdmin) {
    throw new AppError("Superadmin account cannot be deleted.", 403);
  }

  await user.softDelete();

  logger.info(`[deleteUser] User ${userId} soft-deleted by ${deletedBy}`);
  return { message: "User deleted successfully." };
};

// ─── Get User By ID ───────────────────────────────────────────────────────────

export const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .populate("role", "name permissions")
    .populate("store", "name logo")
    .lean();

  if (!user) throw new AppError("User not found.", 404);
  return { user: _sanitize(user) };
};

// ─── Get All Users ────────────────────────────────────────────────────────────

export const getUsers = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.roleName) filter.roleName = query.roleName;
  if (query.store) filter.store = query.store;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate("role", "name")
      .populate("store", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    users: users.map(_sanitize),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

// ─── Reset User Password (Admin) ──────────────────────────────────────────────

/**
 * Admin manually resets a user's password.
 * Generates a new system password, sets isFirstLogin=true,
 * emails the new credentials.
 */
export const resetUserPasswordByAdmin = async (userId, adminId) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError("User not found.", 404);

  const { generatePassword } = await import("../../utils/generatePassword.js");
  const plainPassword = generatePassword();

  user.password = plainPassword; // hashed by pre-save hook
  user.isFirstLogin = true;
  await user.save();

  try {
    const { sendEmail } = await import("../../utils/sendEmail.js");
    await sendEmail({
      to: user.email,
      subject: "Your Password Has Been Reset",
      template: "resetPassword",
      data: {
        name: user.name,
        temporaryPassword: plainPassword,
        loginUrl: `${process.env.ADMIN_URL}/auth/login`,
      },
    });
  } catch (err) {
    logger.error(
      `[resetUserPasswordByAdmin] Email failed for ${user.email}: ${err.message}`,
    );
  }

  logger.info(
    `[resetUserPasswordByAdmin] Password reset for user ${userId} by admin ${adminId}`,
  );
  return {
    message:
      "Password reset successfully. New credentials sent to user's email.",
  };
};

// ─── Private Helper ───────────────────────────────────────────────────────────

function _sanitize(user) {
  const doc = user.toObject ? user.toObject() : { ...user };
  delete doc.password;
  delete doc.refreshToken;
  delete doc.passwordResetToken;
  delete doc.passwordResetExpires;
  delete doc.otp;
  return doc;
}
