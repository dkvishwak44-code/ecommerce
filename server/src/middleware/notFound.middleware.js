"use strict";

/**
 * src/middleware/notFound.middleware.js
 * Catches any request that didn't match a registered route.
 */
function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
export { notFoundMiddleware };