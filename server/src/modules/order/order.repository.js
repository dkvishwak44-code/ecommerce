import Order from "./order.model.js";

export const create = (payload) => Order.create(payload);

export const findById = (id) => Order.findById(id);

export const findCustomerOrderById = (customerId, orderId) => {
  return Order.findOne({ _id: orderId, customer: customerId });
};

export const findByRazorpayOrderId = (razorpayOrderId) => {
  return Order.findOne({ "payment.razorpayOrderId": razorpayOrderId }).select("+payment.razorpaySignature");
};

export const listByCustomer = async (customerId, { page = 1, limit = 10, status } = {}) => {
  const skip = (page - 1) * limit;
  const filter = { customer: customerId };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
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

export const save = (order) => order.save();
