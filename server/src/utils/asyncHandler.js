/**
 * asyncHandler
 * Wraps an async Express route handler / middleware and automatically
 * forwards any rejected promise or thrown error to next(err).
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res, next) => { ... }));
 *
 * @param {Function} fn - Async function (req, res, next) => Promise
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export  {asyncHandler};