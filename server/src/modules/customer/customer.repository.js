/**
 * Customer Repository
 * All direct DB queries for the Customer model live here.
 * Service layer calls repository — never touches the model directly.
 */

import Customer from "./customer.model.js";
// import { buildPaginationMeta } from "../constants/pagination.js";

// ── Auth queries ──────────────────────────────────────────────────────────────

export const findByEmail = (email) =>
  Customer.findOne({ email: email.toLowerCase() });

export const findByEmailWithPassword = (email) =>
  Customer.findByEmailWithPassword(email);

export const findById = (id) =>
  Customer.findById(id);

export const findByIdWithPassword = (id) =>
  Customer.findById(id).select("+password");

export const findByResetToken = (token) =>
  Customer.findOne({
    passwordResetToken:   token,
    passwordResetExpires: { $gt: Date.now() },
  });

// ── OTP ───────────────────────────────────────────────────────────────────────

export const findByEmailWithOtp = (email) =>
  Customer.findOne({ email: email.toLowerCase() }).select("+otp");

// ── Profile ───────────────────────────────────────────────────────────────────

export const createCustomer = (data) =>
  Customer.create(data);

export const updateCustomerById = (id, data) =>
  Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteCustomerById = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) return null;
  return customer.softDelete();
};

// ── Address ───────────────────────────────────────────────────────────────────

export const addAddress = async (customerId, addressData) => {
  return Customer.findByIdAndUpdate(
    customerId,
    { $push: { addresses: addressData } },
    { new: true, runValidators: true }
  );
};

export const updateAddress = async (customerId, addressId, addressData) => {
  return Customer.findOneAndUpdate(
    { _id: customerId, "addresses._id": addressId },
    {
      $set: {
        "addresses.$.label":      addressData.label,
        "addresses.$.line1":      addressData.line1,
        "addresses.$.line2":      addressData.line2,
        "addresses.$.city":       addressData.city,
        "addresses.$.state":      addressData.state,
        "addresses.$.postalCode": addressData.postalCode,
        "addresses.$.country":    addressData.country,
        "addresses.$.phone":      addressData.phone,
      },
    },
    { new: true, runValidators: true }
  );
};

export const deleteAddress = async (customerId, addressId) => {
  return Customer.findByIdAndUpdate(
    customerId,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );
};

export const setDefaultAddress = async (customerId, addressId) => {
  // Unset all defaults first, then set the chosen one
  await Customer.findByIdAndUpdate(customerId, {
    $set: { "addresses.$[].isDefault": false },
  });
  return Customer.findOneAndUpdate(
    { _id: customerId, "addresses._id": addressId },
    { $set: { "addresses.$.isDefault": true } },
    { new: true }
  );
};

// ── Admin queries (used by admin customer.controller) ─────────────────────────

export const findAllCustomers = async ({
  page = 1,
  limit = 10,
  sort = "-createdAt",
  search = "",
  status,
} = {}) => {
  const filter = {};
  if (status)             filter.status = status;
  if (search) {
    filter.$or = [
      { name:  { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const skip  = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Customer.find(filter).sort(sort).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);

  return { data, meta: buildPaginationMeta({ page, limit, total }) };
};

export const findCustomerWithOrders = (customerId) =>
  Customer.findById(customerId).populate({
    path:    "orders",   // virtual or populated separately in service
    options: { sort: { createdAt: -1 }, limit: 10 },
  });

// ── Stats update (called from order.service after order placed/refunded) ──────

export const incrementOrderStats = (customerId, amount) =>
  Customer.findByIdAndUpdate(customerId, {
    $inc: {
      "stats.totalOrders": 1,
      "stats.totalSpent":  amount,
    },
  });

export const incrementReviewCount = (customerId) =>
  Customer.findByIdAndUpdate(customerId, {
    $inc: { "stats.totalReviews": 1 },
  });

export const incrementReturnCount = (customerId) =>
  Customer.findByIdAndUpdate(customerId, {
    $inc: { "stats.totalReturns": 1 },
  });