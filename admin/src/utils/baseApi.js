// src/utils/base-api.js

import api from "./api";

/**
 * BaseApi — Production-level reusable API class
 * Extend this class for every feature service
 *
 * @example
 * class ProductService extends BaseApi {
 *   constructor() { super("/products"); }
 * }
 * export const productService = new ProductService();
 */

class BaseApi {
  #basePath = "";
  #cache    = new Map();

  constructor(basePath = "") {
    if (!basePath.startsWith("/")) {
      console.warn(`[BaseApi] basePath should start with "/", got: "${basePath}"`);
    }
    this.#basePath = basePath;
  }

  // ── URL Builder ─────────────────────────────────────────────
  url(path = "") {
    return `${this.#basePath}${path}`;
  }

  // ── Cache Key Builder ────────────────────────────────────────
  #cacheKey(path, params = {}) {
    return `${path}:${JSON.stringify(params)}`;
  }

  // ── Request Wrapper with logging ────────────────────────────
  async #request(method, path, options = {}) {
    const { data, params, config = {}, cache = false, cacheTTL = 30000 } = options;

    const cacheKey = this.#cacheKey(path, params);

    // ── Return cached response if available ──────────────────
    if (cache && this.#cache.has(cacheKey)) {
      const { value, expiresAt } = this.#cache.get(cacheKey);
      if (Date.now() < expiresAt) {
        return value;
      }
      this.#cache.delete(cacheKey); // expired → remove
    }

    try {
      let response;

      switch (method) {
        case "GET":
          response = await api.get(path, { params, ...config });
          break;
        case "POST":
          response = await api.post(path, data, config);
          break;
        case "PUT":
          response = await api.put(path, data, config);
          break;
        case "PATCH":
          response = await api.patch(path, data, config);
          break;
        case "DELETE":
          response = await api.delete(path, config);
          break;
        default:
          throw new Error(`[BaseApi] Unsupported method: ${method}`);
      }

      // ── Cache GET responses ──────────────────────────────────
      if (cache && method === "GET") {
        this.#cache.set(cacheKey, {
          value:     response,
          expiresAt: Date.now() + cacheTTL,
        });
      }

      return response;

    } catch (error) {
      this.#handleError(method, path, error);
      throw error;
    }
  }

  // ── Error Handler ────────────────────────────────────────────
  #handleError(method, path, error) {
    const status  = error?.status  || "NETWORK_ERROR";
    const message = error?.message || "Something went wrong";

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[BaseApi] ${method} ${path} failed`,
        `| Status: ${status}`,
        `| Message: ${message}`
      );
    }
  }

  // ── Public Methods ───────────────────────────────────────────

  /**
   * GET list with optional query params
   * @param {object} params  - query params e.g. { page: 1, limit: 10 }
   * @param {object} config  - axios config
   * @param {boolean} cache  - enable caching
   * @param {number} cacheTTL - cache duration in ms (default 30s)
   */
  get(params = {}, config = {}, { cache = false, cacheTTL = 30000 } = {}) {
    return this.#request("GET", this.url(""), { params, config, cache, cacheTTL });
  }

  /**
   * GET single item by ID
   * @param {string|number} id
   * @param {object} config
   * @param {boolean} cache
   */
  getById(id, config = {}, { cache = false, cacheTTL = 30000 } = {}) {
    if (!id) throw new Error("[BaseApi] getById requires an id");
    return this.#request("GET", this.url(`/${id}`), { config, cache, cacheTTL });
  }

  /**
   * GET from custom path
   * @param {string} path  - e.g. "/me", "/profile"
   * @param {object} params
   * @param {object} config
   */
  getFrom(path, params = {}, config = {}) {
    return this.#request("GET", this.url(path), { params, config });
  }

  /**
   * POST — create new resource
   * @param {object|FormData} data
   * @param {object} config
   */
  post(data, config = {}) {
    return this.#request("POST", this.url(""), { data, config });
  }

  /**
   * POST to custom path
   * @param {string} path  - e.g. "/login", "/upload"
   * @param {object|FormData} data
   * @param {object} config
   */
  postTo(path, data, config = {}) {
    return this.#request("POST", this.url(path), { data, config });
  }

  /**
   * PUT — full update
   * @param {string|number} id
   * @param {object|FormData} data
   * @param {object} config
   */
  put(id, data, config = {}) {
    if (!id) throw new Error("[BaseApi] put requires an id");
    this.clearCache(); // invalidate cache on update
    return this.#request("PUT", this.url(`/${id}`), { data, config });
  }

  /**
   * PUT to custom path (no id needed)
   * @param {string} path
   * @param {object} data
   * @param {object} config
   */
  putTo(path, data, config = {}) {
    this.clearCache();
    return this.#request("PUT", this.url(path), { data, config });
  }

  /**
   * PATCH — partial update
   * @param {string|number} id
   * @param {object} data
   * @param {object} config
   */
  patch(id, data, config = {}) {
    if (!id) throw new Error("[BaseApi] patch requires an id");
    this.clearCache();
    return this.#request("PATCH", this.url(`/${id}`), { data, config });
  }

  /**
   * PATCH to custom path
   * @param {string} path
   * @param {object} data
   * @param {object} config
   */
  patchTo(path, data, config = {}) {
    this.clearCache();
    return this.#request("PATCH", this.url(path), { data, config });
  }

  /**
   * DELETE — remove resource
   * @param {string|number} id
   * @param {object} config
   */
  delete(id, config = {}) {
    if (!id) throw new Error("[BaseApi] delete requires an id");
    this.clearCache();
    return this.#request("DELETE", this.url(`/${id}`), { config });
  }

  /**
   * DELETE to custom path
   * @param {string} path
   * @param {object} config
   */
  deleteTo(path, config = {}) {
    this.clearCache();
    return this.#request("DELETE", this.url(path), { config });
  }

  /**
   * Upload file (FormData)
   * @param {string} path  - e.g. "/upload", "/:id/avatar"
   * @param {FormData} formData
   */
  upload(path, formData) {
    if (!(formData instanceof FormData)) {
      throw new Error("[BaseApi] upload requires FormData");
    }
    return this.#request("POST", this.url(path), {
      data:   formData,
      config: {}, // axios auto sets multipart/form-data for FormData
    });
  }

  // ── Cache Utilities ──────────────────────────────────────────

  /** Clear all cached responses for this service */
  clearCache() {
    this.#cache.clear();
  }

  /** Clear cache for a specific path */
  clearCacheFor(path, params = {}) {
    const key = this.#cacheKey(this.url(path), params);
    this.#cache.delete(key);
  }

  /** Get cache size (for debugging) */
  get cacheSize() {
    return this.#cache.size;
  }
}

export default BaseApi;