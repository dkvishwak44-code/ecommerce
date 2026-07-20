import Customer from "../../customer/customer.model.js";
import Product from "../../product/product.model.js";
import * as cartRepository from "../../cart/cart.repository.js";
import * as orderRepository from "../order.repository.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../shared/payment.helpers.js";
import { AppError } from "../../../utils/AppError.js";
import { MESSAGES } from "../../../constants/messages.js";
import { ORDER_STATUS } from "../../../constants/orderStatus.js";

const roundTo2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const createOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

const getCustomerAddress = async (customerId, addressId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new AppError(MESSAGES.CUSTOMER.NOT_FOUND, 404);

  const address = addressId
    ? customer.addresses.id(addressId)
    : customer.defaultAddress;

  if (!address) throw new AppError("Shipping address not found.", 404);
  return address.toObject();
};

const mapCartItemToOrderItem = (item) => ({
  product: item.product?._id || item.product,
  variantId: item.variantId || null,
  name: item.productSnapshot?.name || item.product?.name,
  sku: item.productSnapshot?.sku || item.product?.sku || null,
  image: item.productSnapshot?.image || item.product?.thumbnail?.url || null,
  variant: item.productSnapshot?.variant || null,
  storeId: item.productSnapshot?.storeId || item.product?.storeId || null,
  quantity: item.quantity,
  price: item.price,
  subtotal: item.subtotal,
});

const ensureCartReady = async (customerId) => {
  const cart = await cartRepository.findOrCreateByCustomer(customerId);
  if (!cart.items.length) throw new AppError(MESSAGES.CART.EMPTY, 400);

  for (const item of cart.items) {
    const product = await Product.findById(item.product?._id || item.product);
    if (!product || !product.isPublished || product.status !== "active") {
      throw new AppError(`Product is no longer available: ${item.productSnapshot?.name || "item"}.`, 400);
    }

    const variant = item.variantId ? product.variants.id(item.variantId) : null;
    const stock = variant ? variant.stock : product.stock;
    if (item.quantity > stock) {
      throw new AppError(`Only ${stock} item(s) available for ${product.name}.`, 400);
    }
  }

  return cart;
};

export const getCheckoutSummary = async (customerId) => {
  const cart = await cartRepository.findOrCreateByCustomer(customerId);
  if (!cart.items.length) throw new AppError(MESSAGES.CART.EMPTY, 400);

  return {
    cart,
    payment: {
      provider: "razorpay",
      keyId: process.env.RAZORPAY_KEY_ID || null,
      currency: "INR",
    },
  };
};

export const initiateCheckout = async (customerId, payload) => {
  const cart = await ensureCartReady(customerId);
  const shippingAddress = payload.shippingAddress || await getCustomerAddress(customerId, payload.shippingAddressId);
  const billingAddress = payload.billingAddress || shippingAddress;
  const subtotal = roundTo2(cart.totals.subtotal);
  const discount = roundTo2(cart.totals.discount || 0);
  const shipping = 0;
  const tax = 0;
  const total = roundTo2(subtotal - discount + shipping + tax);
  const orderNumber = createOrderNumber();

  const razorpayOrder = await createRazorpayOrder({
    amount: total,
    currency: "INR",
    receipt: orderNumber,
    notes: { customerId: String(customerId), orderNumber },
  });

  const order = await orderRepository.create({
    orderNumber,
    customer: customerId,
    items: cart.items.map(mapCartItemToOrderItem),
    shippingAddress,
    billingAddress,
    coupon: cart.coupon,
    totals: {
      itemsCount: cart.totals.itemsCount,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      currency: "INR",
    },
    payment: {
      provider: "razorpay",
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
    },
    notes: { customer: payload.notes || null },
  });

  return {
    order,
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    },
  };
};

export const verifyPayment = async (customerId, payload) => {
  const isValid = verifyRazorpaySignature({
    razorpayOrderId: payload.razorpay_order_id,
    razorpayPaymentId: payload.razorpay_payment_id,
    razorpaySignature: payload.razorpay_signature,
  });

  const order = await orderRepository.findByRazorpayOrderId(payload.razorpay_order_id);
  if (!order || String(order.customer) !== String(customerId)) {
    throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  }

  if (!isValid) {
    order.status = ORDER_STATUS.PAYMENT_FAILED;
    order.payment.status = "failed";
    order.payment.failureReason = "Invalid Razorpay signature.";
    order.statusHistory.push({ status: order.status, note: order.payment.failureReason });
    await order.save();
    throw new AppError("Payment verification failed.", 400);
  }

  order.status = ORDER_STATUS.CONFIRMED;
  order.payment.status = "paid";
  order.payment.razorpayPaymentId = payload.razorpay_payment_id;
  order.payment.razorpaySignature = payload.razorpay_signature;
  order.payment.paidAt = new Date();
  order.statusHistory.push({ status: order.status, note: "Payment verified." });
  await order.save();

  const cart = await cartRepository.findOrCreateByCustomer(customerId);
  cart.items = [];
  cart.coupon = { code: null, discount: 0 };
  await cart.save();

  return { order };
};

export const getOrderConfirmation = async (customerId, orderId) => {
  const order = await orderRepository.findCustomerOrderById(customerId, orderId).lean();
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  return { order };
};
