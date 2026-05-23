/**
 * Standardised API response utilities.
 * All responses follow the shape:
 *   { success, message, data?, meta?, errors? }
 */

/**
 * Send a success response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string}  [options.message='Success']
 * @param {*}       [options.data=null]
 * @param {object}  [options.meta=null]      - Pagination or extra metadata
 * @param {number}  [options.statusCode=200]
 */
const sendSuccess = (res, { message = 'Success', result = null, meta = null, statusCode = 200 } = {}) => {
  const payload = { success: true, message };
  console.log("result :",result);
  if (result !== null && result !== undefined) payload.result = result;
  if (meta !== null && meta !== undefined) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

/**
 * Send a created (201) response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 */
const sendCreated = (res, { message = 'Created successfully', data = null, meta = null } = {}) => {
  return sendSuccess(res, { message, data, meta, statusCode: 201 });
};

/**
 * Send a no-content (204) response (no body).
 *
 * @param {import('express').Response} res
 */
const sendNoContent = (res) => {
  return res.status(204).send();
};

/**
 * Send an error response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string}   [options.message='An error occurred']
 * @param {number}   [options.statusCode=500]
 * @param {string}   [options.errorCode]   - Machine-readable error code
 * @param {Array}    [options.errors]      - Validation error details
 */
const sendError = (res, { message = 'An error occurred', statusCode = 500, errorCode = null, errors = null } = {}) => {
  const payload = { success: false, message };
  if (errorCode) payload.errorCode = errorCode;
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

/**
 * 400 Bad Request.
 */
const sendBadRequest = (res, message = 'Bad request', errors = null) =>
  sendError(res, { message, statusCode: 400, errors });

/**
 * 401 Unauthorized.
 */
const sendUnauthorized = (res, message = 'Unauthorized') =>
  sendError(res, { message, statusCode: 401 });

/**
 * 403 Forbidden.
 */
const sendForbidden = (res, message = 'Forbidden') =>
  sendError(res, { message, statusCode: 403 });

/**
 * 404 Not Found.
 */
const sendNotFound = (res, message = 'Resource not found') =>
  sendError(res, { message, statusCode: 404 });

/**
 * 409 Conflict.
 */
const sendConflict = (res, message = 'Conflict') =>
  sendError(res, { message, statusCode: 409 });

/**
 * 422 Unprocessable Entity (validation errors).
 */
const sendValidationError = (res, message = 'Validation failed', errors = null) =>
  sendError(res, { message, statusCode: 422, errors });

/**
 * 429 Too Many Requests.
 */
const sendTooManyRequests = (res, message = 'Too many requests, please try again later') =>
  sendError(res, { message, statusCode: 429 });

/**
 * 500 Internal Server Error.
 */
const sendServerError = (res, message = 'Internal server error') =>
  sendError(res, { message, statusCode: 500 });

/**
 * Paginated list response helper.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {Array}   options.data
 * @param {object}  options.meta  - Pagination meta (from buildPaginationMeta)
 * @param {string}  [options.message='Fetched successfully']
 */
const sendPaginated = (res, { data, meta, message = 'Fetched successfully' }) => {
  return sendSuccess(res, { message, data, meta });
};

export {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendValidationError,
  sendTooManyRequests,
  sendServerError,
  sendPaginated,
};