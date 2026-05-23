const nodemailer = require('nodemailer');
const env = require('./env');
const logger = require('./logger');

/**
 * Nodemailer transporter instance.
 * Configured from environment variables via config/env.js
 */
const transporter = nodemailer.createTransport({
  host:   env.MAIL_HOST,
  port:   env.MAIL_PORT,
  secure: env.MAIL_SECURE, // true for port 465, false for 587
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
  // Improve delivery reliability
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000, // 1 second between messages
  rateLimit: 5,    // max 5 messages per rateDelta
});

/**
 * Verify SMTP connection on startup.
 * Logs a warning if the connection fails — does NOT throw,
 * so the app can still start without mail in dev/test.
 */
const verifyMailConnection = async () => {
  try {
    await transporter.verify();
    logger.info('Mail transporter connected successfully');
  } catch (err) {
    logger.warn('Mail transporter connection failed:', err.message);
  }
};

module.exports = transporter;
module.exports.verifyMailConnection = verifyMailConnection;