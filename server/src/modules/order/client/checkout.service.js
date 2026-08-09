/**
 * Client Checkout Service
 * Handles the checkout flow: summary → initiate → verify → confirmation.
 * Uses COD as default payment method.
 */

import * as orderRepo from "../order.repository.js";
import * as cartRepo from "../../cart/cart.repository.js";
import * as couponRepo from "../../coupon/coupon.repository.js";
import * as customerRepo from "../../customer/customer.repository.js";
import Product from "../../product/product.model.js";
import { ORDER_STATUS } from "../order.model.js";
import { PAYMENT_STATUS } from "../../../constants/status.js";
import { AppError } from "../../../utils/AppError.js";
import { MESSAGES } from "../../../constants/messages.js";

/**
 * Step 1 — Preview checkout summary from the customer's cart.
 */
export const getCheckoutSummary = async (customerId) => {
  const cart = await cartRepo.findByCustomer(customerId);
  if (!cart || cart.items.length === 0) {
    throw new AppError(MESSAGES.CART.EMPTY, 400);
  }

  // Re-validate stock & prices
  const validatedItems = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product).lean();
    if (!product || product.status !== "active" || !product.isPublished) continue;
    if (product.stock < item.quantity) {
      throw new AppError(`"${product.name}" only has ${product.stock} in stock.`, 400);
    }
    validatedItems.push({
      ...item,
      price: product.price,
      salePrice: product.salePrice,
      name: product.name,
    });
  }

  if (validatedItems.length === 0) {
    throw new AppError("No valid items in cart.", 400);
  }

  const subtotal = validatedItems.reduce((sum, item) => {
    const unitPrice = item.salePrice != null ? item.salePrice : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const shippingCost = subtotal >= 500 ? 0 : 50; // Free shipping over ₹500
  const tax = 0; // Placeholder — integrate calculateTax as needed
  const discount = cart.discount || 0;
  const total = Math.max(0, subtotal - discount + tax + shippingCost);

  return {
    items: validatedItems,
    subtotal,
    discount,
    coupon: cart.coupon?.code ? cart.coupon : null,
    tax,
    shippingCost,
    total,
    itemCount: validatedItems.reduce((sum, i) => sum + i.quantity, 0),
  };
};

/**
 * Step 2 — Create order from cart.
 */
export const initiateCheckout = async (customerId, data) => {
  const { shippingAddressId, shippingAddress: rawAddress, billingAddress, paymentMethod = "cod", customerNote } = data;

  // Get cart
  const cart = await cartRepo.findByCustomerRaw(customerId);
  if (!cart || cart.items.length === 0) {
    throw new AppError(MESSAGES.CART.EMPTY, 400);
  }

  // Resolve shipping address
  let shippingAddress = rawAddress;
  if (shippingAddressId && !rawAddress) {
    const customer = await customerRepo.findById(customerId);
    const addr = customer?.addresses?.id(shippingAddressId);
    if (!addr) throw new AppError(MESSAGES.ADDRESS.NOT_FOUND, 404);
    shippingAddress = addr.toObject();
  }
  if (!shippingAddress) {
    throw new AppError("Shipping address is required.", 400);
  }

  // Validate stock & build order items
  const orderItems = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || product.status !== "active" || !product.isPublished) {
      throw new AppError(`"${item.name}" is no longer available.`, 400);
    }
    if (product.stock < item.quantity) {
      throw new AppError(`"${product.name}" only has ${product.stock} in stock.`, 400);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      thumbnail: product.thumbnail?.url || product.images?.[0]?.url || null,
      price: product.price,
      salePrice: product.salePrice,
      quantity: item.quantity,
      variant: item.variant || {},
      total: (product.salePrice != null ? product.salePrice : product.price) * item.quantity,
      store: product.storeId,
    });

    // Decrement stock
    product.stock -= item.quantity;
    product.totalSales += item.quantity;
    await product.save();
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const shippingCost = subtotal >= 500 ? 0 : 50;
  const discount = cart.discount || 0;
  const tax = 0;
  const total = Math.max(0, subtotal - discount + tax + shippingCost);

  // Create order
  const order = await orderRepo.create({
    customer: customerId,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PENDING,
    status: paymentMethod === "cod" ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING,
    subtotal,
    discount,
    tax,
    shippingCost,
    total,
    coupon: cart.coupon?.code
      ? { code: cart.coupon.code, couponId: cart.coupon.couponId, discountAmount: cart.coupon.discountAmount }
      : {},
    customerNote,
    statusHistory: [{ status: paymentMethod === "cod" ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING, updatedAt: new Date() }],
  });

  // Increment coupon usage if applied
  if (cart.coupon?.couponId) {
    await couponRepo.incrementUsage(cart.coupon.couponId, customerId, order._id);
  }

  // Increment customer stats
  await customerRepo.incrementOrderStats(customerId, total);

  // Clear the cart
  cart.items = [];
  cart.coupon = { code: null, couponId: null, discountType: null, discountValue: 0, discountAmount: 0 };
  cart.recalculate();
  await cart.save();

  return {
    order: {
      _id: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    },
    message: paymentMethod === "cod"
      ? "Order placed successfully! Pay on delivery."
      : "Order created. Complete payment to confirm.",
  };
};

/**
 * Step 3 — Verify payment (for online payment methods).
 * For COD orders, this step is skipped.
 */
export const verifyPayment = async (customerId, { orderId, gatewayPaymentId, gatewaySignature }) => {
  const order = await orderRepo.findByIdRaw(orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  if (order.customer.toString() !== customerId.toString()) {
    throw new AppError(MESSAGES.GENERIC.FORBIDDEN, 403);
  }

  // In a real implementation, verify the signature with Razorpay/Stripe SDK here
  // For now, accept the payment as verified
  order.paymentStatus = PAYMENT_STATUS.PAID;
  order.paymentDetails = {
    gatewayPaymentId,
    gatewaySignature,
    paidAt: new Date(),
  };
  order.status = ORDER_STATUS.CONFIRMED;
  await order.save();

  return {
    order: {
      _id: order._id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      status: order.status,
    },
  };
};

/**
 * Step 4 — Get order confirmation page data.
 */
export const getOrderConfirmation = async (customerId, orderId) => {
  const order = await orderRepo.findById(orderId);
  if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
  if (order.customer._id.toString() !== customerId.toString()) {
    throw new AppError(MESSAGES.GENERIC.FORBIDDEN, 403);
  }

  return { order };
};
