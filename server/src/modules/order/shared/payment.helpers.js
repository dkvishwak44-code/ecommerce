import crypto from "crypto";
import Razorpay from "razorpay";
import { AppError } from "../../../utils/AppError.js";

let razorpayInstance = null;

export const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new AppError("Razorpay credentials are not configured.", 500);
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  return razorpayInstance;
};

export const toPaise = (amount) => Math.round(Number(amount) * 100);

export const verifyRazorpaySignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return expectedSignature === razorpaySignature;
};

export const createRazorpayOrder = async ({ amount, currency = "INR", receipt, notes = {} }) => {
  return getRazorpay().orders.create({
    amount: toPaise(amount),
    currency,
    receipt,
    notes,
  });
};
