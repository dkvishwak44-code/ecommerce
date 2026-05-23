/**
 * Slug generation utilities.
 * Converts human-readable strings into URL-friendly slugs.
 */

/**
 * Convert a string to a URL-safe slug.
 *
 * @param {string} text - Input string (e.g. product name, category title)
 * @param {object} [options]
 * @param {string}  [options.separator='-']    - Word separator character
 * @param {boolean} [options.lowercase=true]   - Convert to lowercase
 * @param {boolean} [options.strict=false]     - Strip all non-alphanumeric chars (except separator)
 * @returns {string}
 *
 * @example
 * slugify('Hello World!') // → 'hello-world'
 * slugify('Café & Résumé') // → 'cafe-resume'
 */
const slugify = (text, { separator = '-', lowercase = true, strict = false } = {}) => {
  if (!text) return '';

  let slug = String(text)
    // Normalise unicode: decompose accented chars (é → e + ́)
    .normalize('NFD')
    // Remove combining diacritical marks
    .replace(/[\u0300-\u036f]/g, '')
    // Replace & with 'and'
    .replace(/&/g, `${separator}and${separator}`)
    // Replace whitespace and underscores with separator
    .replace(/[\s_]+/g, separator);

  if (strict) {
    // Keep only alphanumeric and separator
    slug = slug.replace(new RegExp(`[^a-zA-Z0-9${escapeRegex(separator)}]`, 'g'), '');
  } else {
    // Remove all chars that aren't alphanumeric, separator, or dash
    slug = slug.replace(/[^a-zA-Z0-9-_.]/g, '');
  }

  // Replace multiple consecutive separators with a single one
  slug = slug.replace(new RegExp(`${escapeRegex(separator)}+`, 'g'), separator);

  // Trim leading/trailing separators
  slug = slug.replace(new RegExp(`^${escapeRegex(separator)}+|${escapeRegex(separator)}+$`, 'g'), '');

  return lowercase ? slug.toLowerCase() : slug;
};

/**
 * Generate a unique slug by appending a numeric suffix if the base slug already exists.
 *
 * @param {string}   baseSlug  - The desired slug
 * @param {Function} existsFn  - Async function (slug: string) => boolean
 * @param {number}   [maxTries=100]
 * @returns {Promise<string>} A unique slug
 *
 * @example
 * const slug = await uniqueSlug('my-product', async (s) => {
 *   return !!(await Product.findOne({ slug: s }));
 * });
 */
const uniqueSlug = async (baseSlug, existsFn, maxTries = 100) => {
  const slug = slugify(baseSlug);
  if (!(await existsFn(slug))) return slug;

  for (let i = 2; i <= maxTries; i++) {
    const candidate = `${slug}-${i}`;
    if (!(await existsFn(candidate))) return candidate;
  }

  // Fallback: append random suffix
  const random = Math.random().toString(36).slice(2, 7);
  return `${slug}-${random}`;
};

/**
 * Generate a slug from multiple parts joined by a separator.
 * Useful for building slugs like "brand-product-name".
 *
 * @param {...string} parts
 * @returns {string}
 */
const slugifyParts = (...parts) => {
  return parts
    .map((p) => slugify(p))
    .filter(Boolean)
    .join('-');
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export {
  slugify,
  uniqueSlug,
  slugifyParts,
};