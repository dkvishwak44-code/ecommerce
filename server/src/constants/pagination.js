/**
 * Pagination constants used across the application.
 * These are referenced by utils/pagination.js and ApiFeatures.
 */

/** Default number of items per page */
const DEFAULT_PAGE_SIZE = 10;

/** Maximum allowed items per page (prevents abuse) */
const MAX_PAGE_SIZE = 100;

/** Default page number */
const DEFAULT_PAGE = 1;

/** Page size options available to clients */
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_PAGE,
  PAGE_SIZE_OPTIONS,
};


/**
 * PAGINATION
 *
 * Default pagination settings used across all list endpoints.
 * Override per-request via query params: ?page=2&limit=20&sort=-createdAt
 *
 * Usage:
 *   import { PAGINATION } from "../constants/pagination.js";
 *   PAGINATION.DEFAULT_PAGE   →  1
 *   PAGINATION.DEFAULT_LIMIT  →  10
 */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,       // hard cap — prevents abuse on large collections

  // Common sort options (value = Mongoose sort string)
  SORT: {
    NEWEST: "-createdAt",
    OLDEST: "createdAt",
    NAME_ASC: "name",
    NAME_DESC: "-name",
    PRICE_ASC: "price",
    PRICE_DESC: "-price",
    RATING_DESC: "-rating",
    POPULAR: "-soldCount",
  },

  DEFAULT_SORT: "-createdAt",
};

/**
 * Builds a normalised pagination object from raw query params.
 * Ensures page/limit are positive integers within bounds.
 *
 * @param {{ page?: string|number, limit?: string|number, sort?: string }} query
 * @returns {{ page: number, limit: number, skip: number, sort: string }}
 */
export const parsePagination = (query = {}) => {
  let page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
  const sort = query.sort || PAGINATION.DEFAULT_SORT;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort,
  };
};

/**
 * Builds the standard pagination metadata block for API responses.
 *
 * @param {{ page: number, limit: number, total: number }} params
 * @returns {{ page: number, limit: number, total: number, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean }}
 */
export const buildPaginationMeta = ({ page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};