const redis = require('../config/redis');
const logger = require('../config/logger');

/** Default TTL in seconds (15 minutes) */
const DEFAULT_TTL = 60 * 15;

/**
 * Set a value in cache.
 *
 * @param {string} key - Cache key
 * @param {*} value - Value to cache (will be JSON-serialized)
 * @param {number} [ttl=DEFAULT_TTL] - Time-to-live in seconds
 * @returns {Promise<boolean>} true on success
 */
const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    const serialized = JSON.stringify(value);
    await redis.set(key, serialized, 'EX', ttl);
    return true;
  } catch (err) {
    logger.error(`Cache SET error [${key}]:`, err);
    return false;
  }
};

/**
 * Get a value from cache.
 *
 * @param {string} key - Cache key
 * @returns {Promise<*|null>} Parsed value or null if not found
 */
const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    logger.error(`Cache GET error [${key}]:`, err);
    return null;
  }
};

/**
 * Delete a specific cache key.
 *
 * @param {string} key - Cache key
 * @returns {Promise<boolean>}
 */
const deleteCache = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch (err) {
    logger.error(`Cache DEL error [${key}]:`, err);
    return false;
  }
};

/**
 * Delete all cache keys matching a pattern.
 * Uses SCAN to avoid blocking the Redis server.
 *
 * @param {string} pattern - Glob pattern e.g. 'products:*'
 * @returns {Promise<number>} Number of keys deleted
 */
const deleteCacheByPattern = async (pattern) => {
  try {
    let cursor = '0';
    let deleted = 0;

    do {
      const [newCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = newCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
        deleted += keys.length;
      }
    } while (cursor !== '0');

    return deleted;
  } catch (err) {
    logger.error(`Cache pattern DEL error [${pattern}]:`, err);
    return 0;
  }
};

/**
 * Cache-aside helper: returns cached value if present, otherwise calls
 * the fetcher function, caches its result, and returns it.
 *
 * @param {string} key - Cache key
 * @param {Function} fetcher - Async function that returns the fresh data
 * @param {number} [ttl=DEFAULT_TTL] - TTL in seconds
 * @returns {Promise<*>}
 */
const remember = async (key, fetcher, ttl = DEFAULT_TTL) => {
  const cached = await getCache(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  if (fresh !== undefined && fresh !== null) {
    await setCache(key, fresh, ttl);
  }
  return fresh;
};

/**
 * Check if a cache key exists.
 *
 * @param {string} key
 * @returns {Promise<boolean>}
 */
const hasCache = async (key) => {
  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (err) {
    logger.error(`Cache EXISTS error [${key}]:`, err);
    return false;
  }
};

/**
 * Increment a numeric counter in cache (e.g. for rate limiting or view counts).
 *
 * @param {string} key
 * @param {number} [ttl] - Set TTL only on first increment (if key is new)
 * @returns {Promise<number>} New counter value
 */
const incrementCache = async (key, ttl = null) => {
  try {
    const value = await redis.incr(key);
    if (value === 1 && ttl) {
      await redis.expire(key, ttl);
    }
    return value;
  } catch (err) {
    logger.error(`Cache INCR error [${key}]:`, err);
    return 0;
  }
};

/**
 * Build a namespaced cache key.
 *
 * @param {...string} parts - Key segments (e.g. 'products', storeId, page)
 * @returns {string}
 */
const cacheKey = (...parts) => parts.filter(Boolean).join(':');

module.exports = {
  setCache,
  getCache,
  deleteCache,
  deleteCacheByPattern,
  remember,
  hasCache,
  incrementCache,
  cacheKey,
  DEFAULT_TTL,
};