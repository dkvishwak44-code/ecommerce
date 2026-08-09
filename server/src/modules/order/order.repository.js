/**
 * Order Repository
 * All direct DB queries for the Order model.
 */

import Order from "./order.model.js";

export const create = (data) =>
  Order.create(data);

export const findById = (id) =>
  Order.findById(id)
    .populate("items.product", "name slug thumbnail")
    .populate("customer", "name email phone")
    .lean();

export const findByIdRaw = (id) =>
  Order.findById(id);

export const findByCustomer = async (customerId, { page = 1, limit = 10, status } = {}) => {
  const skip = (page - 1) * limit;
  const filter = { customer: customerId };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
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

export const findByOrderNumber = (orderNumber) =>
  Order.findOne({ orderNumber })
    .populate("items.product", "name slug thumbnail")
    .lean();

export const updateById = (id, data) =>
  Order.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();

export const updateStatus = async (id, status, note = null, updatedBy = null) => {
  const order = await Order.findById(id);
  if (!order) return null;
  order.status = status;
  order.statusHistory.push({ status, note, updatedBy, updatedAt: new Date() });
  return order.save();
};
