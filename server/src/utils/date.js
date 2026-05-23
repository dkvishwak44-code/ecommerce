/**
 * Date utility helpers.
 * Pure functions — no external dependencies required.
 */

/**
 * Get the start of a day (00:00:00.000) in UTC.
 * @param {Date|string} [date=new Date()] 
 * @returns {Date}
 */
const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Get the end of a day (23:59:59.999) in UTC.
 * @param {Date|string} [date=new Date()]
 * @returns {Date}
 */
const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};

/**
 * Get the start of the current month (1st, 00:00:00.000 UTC).
 * @param {Date|string} [date=new Date()]
 * @returns {Date}
 */
const startOfMonth = (date = new Date()) => {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0));
};

/**
 * Get the end of the current month (last day, 23:59:59.999 UTC).
 * @param {Date|string} [date=new Date()]
 * @returns {Date}
 */
const endOfMonth = (date = new Date()) => {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59, 999));
};

/**
 * Add a number of days to a date.
 * @param {Date|string} date
 * @param {number} days
 * @returns {Date}
 */
const addDays = (date, days) => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};

/**
 * Add a number of hours to a date.
 * @param {Date|string} date
 * @param {number} hours
 * @returns {Date}
 */
const addHours = (date, hours) => {
  const d = new Date(date);
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  return d;
};

/**
 * Add a number of minutes to a date.
 * @param {Date|string} date
 * @param {number} minutes
 * @returns {Date}
 */
const addMinutes = (date, minutes) => {
  const d = new Date(date);
  d.setTime(d.getTime() + minutes * 60 * 1000);
  return d;
};

/**
 * Check whether a date is in the past.
 * @param {Date|string} date
 * @returns {boolean}
 */
const isPast = (date) => new Date(date) < new Date();

/**
 * Check whether a date is in the future.
 * @param {Date|string} date
 * @returns {boolean}
 */
const isFuture = (date) => new Date(date) > new Date();

/**
 * Check whether a date falls between two dates (inclusive).
 * @param {Date|string} date
 * @param {Date|string} start
 * @param {Date|string} end
 * @returns {boolean}
 */
const isBetween = (date, start, end) => {
  const d = new Date(date).getTime();
  return d >= new Date(start).getTime() && d <= new Date(end).getTime();
};

/**
 * Get the difference between two dates in the specified unit.
 * @param {Date|string} dateA
 * @param {Date|string} dateB
 * @param {'ms'|'seconds'|'minutes'|'hours'|'days'} [unit='ms']
 * @returns {number}
 */
const diffDate = (dateA, dateB, unit = 'ms') => {
  const diff = new Date(dateA).getTime() - new Date(dateB).getTime();
  const divisors = { ms: 1, seconds: 1000, minutes: 60000, hours: 3600000, days: 86400000 };
  return diff / (divisors[unit] || 1);
};

/**
 * Format a date to a readable string.
 * @param {Date|string} date
 * @param {'date'|'datetime'|'time'|'iso'} [format='date']
 * @param {string} [locale='en-IN']
 * @returns {string}
 */
const formatDate = (date, format = 'date', locale = 'en-IN') => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  switch (format) {
    case 'datetime':
      return d.toLocaleString(locale);
    case 'time':
      return d.toLocaleTimeString(locale);
    case 'iso':
      return d.toISOString();
    default:
      return d.toLocaleDateString(locale);
  }
};

/**
 * Get a date range object for analytics queries.
 * @param {'today'|'yesterday'|'last7days'|'last30days'|'thisMonth'|'lastMonth'} period
 * @returns {{ from: Date, to: Date }}
 */
const getDateRange = (period) => {
  const now = new Date();

  switch (period) {
    case 'today':
      return { from: startOfDay(now), to: endOfDay(now) };

    case 'yesterday': {
      const yesterday = addDays(now, -1);
      return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
    }

    case 'last7days':
      return { from: startOfDay(addDays(now, -6)), to: endOfDay(now) };

    case 'last30days':
      return { from: startOfDay(addDays(now, -29)), to: endOfDay(now) };

    case 'thisMonth':
      return { from: startOfMonth(now), to: endOfMonth(now) };

    case 'lastMonth': {
      const firstOfThisMonth = startOfMonth(now);
      const lastMonth = addDays(firstOfThisMonth, -1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    }

    default:
      return { from: startOfDay(now), to: endOfDay(now) };
  }
};

/**
 * Check whether a coupon / deal is currently valid based on date range.
 * @param {Date|string|null} startDate
 * @param {Date|string|null} endDate
 * @returns {boolean}
 */
const isDateRangeValid = (startDate, endDate) => {
  const now = new Date();
  if (startDate && new Date(startDate) > now) return false;
  if (endDate && new Date(endDate) < now) return false;
  return true;
};

export default {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  addDays,
  addHours,
  addMinutes,
  isPast,
  isFuture,
  isBetween,
  diffDate,
  formatDate,
  getDateRange,
  isDateRangeValid,
};