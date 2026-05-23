// const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../constants/pagination');
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants/pagination';

/**
 * Parse and normalise page / limit from query string.
 *
 * @param {object} query - req.query
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    MAX_PAGE_SIZE || 100,
    Math.max(1, parseInt(query.limit, 10) || DEFAULT_PAGE_SIZE || 10)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build a pagination metadata object to attach to API responses.
 *
 * @param {object} options
 * @param {number} options.total   - Total number of documents matching the query
 * @param {number} options.page    - Current page number
 * @param {number} options.limit   - Items per page
 * @returns {{
 *   total: number,
 *   page: number,
 *   limit: number,
 *   totalPages: number,
 *   hasNextPage: boolean,
 *   hasPrevPage: boolean,
 *   nextPage: number|null,
 *   prevPage: number|null
 * }}
 */
const buildPaginationMeta = ({ total, page, limit }) => {
  const totalPages = Math.ceil(total / limit) || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

/**
 * All-in-one helper: parse from query and build pagination meta after a count.
 *
 * @param {object} query  - req.query
 * @param {number} total  - Total matched documents
 * @returns {{ page: number, limit: number, skip: number, meta: object }}
 */
const paginate = (query, total) => {
  const { page, limit, skip } = parsePagination(query);
  const meta = buildPaginationMeta({ total, page, limit });
  return { page, limit, skip, meta };
};

export default {
  parsePagination,
  buildPaginationMeta,
  paginate,
};