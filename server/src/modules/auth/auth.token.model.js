// const mongoose = require("mongoose");
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index auto-deletes
    },
    // Optional metadata
    ipAddress: { type: String },
    userAgent: { type: String },
    deviceId: { type: String },
  },
  { timestamps: true }
);

tokenSchema.index({ userId: 1, isRevoked: 1 });

const Token = mongoose.model("Token", tokenSchema);
export default Token;