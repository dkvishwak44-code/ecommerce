/**
 * ApiFeatures - A utility class for building dynamic Mongoose queries.
 * Supports filtering, searching, sorting, field selection, and pagination.
 *
 * Usage:
 *   const features = new ApiFeatures(Model.find(), req.query)
 *     .filter()
 *     .search(['name', 'description'])
 *     .sort()
 *     .limitFields()
 *     .paginate();
 *   const results = await features.query;
 */
class ApiFeatures {
  /**
   * @param {import('mongoose').Query} query - Mongoose query object
   * @param {object} queryString - req.query object
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filter by query params, excluding reserved keywords.
   * Supports MongoDB operators: gte, gt, lte, lt, in, nin, ne
   */
  filter() {
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'q'];
    const queryObj = { ...this.queryString };
    excludedFields.forEach((field) => delete queryObj[field]);

    // Replace operator keywords with MongoDB $ prefix
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|nin|ne)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Full-text style search across specified fields using regex.
   * @param {string[]} fields - Array of field names to search in
   */
  search(fields = []) {
    const keyword = this.queryString.search || this.queryString.q;
    if (keyword && fields.length > 0) {
      const regex = { $regex: keyword, $options: 'i' };
      const orConditions = fields.map((field) => ({ [field]: regex }));
      this.query = this.query.find({ $or: orConditions });
    }
    return this;
  }

  /**
   * Sort results. Defaults to newest first (-createdAt).
   * Pass ?sort=price,-createdAt in query string for custom sorting.
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Limit returned fields (projection).
   * Pass ?fields=name,price,slug to select only those fields.
   * Always excludes __v.
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Paginate results.
   * Pass ?page=2&limit=20 in query string.
   * Defaults: page=1, limit=10
   */
  paginate() {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(this.queryString.limit, 10) || 10));
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }

  /**
   * Filter by a specific store (multi-tenant support).
   * @param {string|import('mongoose').Types.ObjectId} storeId
   */
  byStore(storeId) {
    if (storeId) {
      this.query = this.query.find({ store: storeId });
    }
    return this;
  }

  /**
   * Filter by active status only.
   */
  onlyActive() {
    this.query = this.query.find({ isActive: true });
    return this;
  }
}

export default ApiFeatures;