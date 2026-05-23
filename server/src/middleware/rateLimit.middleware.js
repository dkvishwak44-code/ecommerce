// const { rateLimit } = require("express-rate-limit");
import rateLimit from "express-rate-limit";

// const rateLimit = require("express-rate-limit");
rateLimit

function rateLimiter({
  windowMs = 15 * 60 * 1000,
  max = 100,
  keyPrefix = "rl",
} = {}) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });
}

export {rateLimiter};