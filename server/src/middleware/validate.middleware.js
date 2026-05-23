// ─── middleware/validate.middleware.js ────────────────────────────────────────
// const AppError = require("../utils/AppError");
import { logger } from "../config/logger.js";
import{ AppError} from "../utils/AppError.js";

/**
 * Zod schema validation middleware.
 * Validates req.body against the given schema.
 * Passes a 422 AppError if validation fails.
 * On success, req.body is replaced with the parsed (coerced + stripped) value.
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const messages = result.error.errors
        .map((e) => e.message)
        .join("; ");
      return next(new AppError(messages, 422));
    }

    req.body = result.data; // replace with sanitized/coerced values
    next();
  };
}

export {validate};

// ─────────────────────────────────────────────────────────────────────────────

// ─── middleware/error.middleware.js ───────────────────────────────────────────
// const logger = require("../config/logger");
// import logger from "../config/logger.js"


function errorMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log all server errors
  if (err.statusCode >= 500) {
    logger.error(
      `[${err.statusCode}] ${err.message} | ${req.method} ${req.originalUrl}`,
      { stack: err.stack }
    );
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field(s): ${field}`,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
    return res.status(422).json({ success: false, message: messages });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token has expired" });
  }

  // Operational errors (AppError instances)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected / programming errors — don't leak details in production
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
}
export {errorMiddleware};