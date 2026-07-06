// utils/dateTime.js

/**
 * Format date
 * @param {string|Date} date
 * @param {Object} options
 * @returns {string}
 */
export const formatDate = (
  date,
  options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", options);
};

/**
 * Format time
 * @param {string|Date} date
 * @returns {string}
 */
export const formatTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format date & time
 * Example: 15 Jul 2025, 04:30 PM
 */
export const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * ISO Date (YYYY-MM-DD)
 */
export const toISODate = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
};

/**
 * Input Date Format (YYYY-MM-DD)
 */
export const formatForInput = (date) => {
  if (!date) return "";

  const d = new Date(date);

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

/**
 * Input DateTime Format (YYYY-MM-DDTHH:mm)
 */
export const formatDateTimeInput = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Relative time
 * Example:
 * Just now
 * 5 minutes ago
 * 2 hours ago
 * 3 days ago
 */
export const timeAgo = (date) => {
  if (!date) return "-";

  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", value: 31536000 },
    { label: "month", value: 2592000 },
    { label: "day", value: 86400 },
    { label: "hour", value: 3600 },
    { label: "minute", value: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.value);

    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

/**
 * Current timestamp
 */
export const now = () => new Date();

/**
 * Current ISO string
 */
export const nowISO = () => new Date().toISOString();

/**
 * Check if date is today
 */
export const isToday = (date) => {
  if (!date) return false;

  const today = new Date();
  const d = new Date(date);

  return (
    today.getFullYear() === d.getFullYear() &&
    today.getMonth() === d.getMonth() &&
    today.getDate() === d.getDate()
  );
};

/**
 * Convert UTC date to local Date object
 */
export const utcToLocal = (utcDate) => {
  if (!utcDate) return null;

  return new Date(utcDate);
};