// const nodemailer = require('nodemailer');
// const logger = require('../config/logger');
import nodemailer from 'nodemailer';
import {logger} from '../config/logger.js';

/**
 * Lazily-created transporter singleton.
 * Config is loaded from environment via config/mail.js or env vars directly.
 */
let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return _transporter;
};

/**
 * Send a single email.
 *
 * @param {object} options
 * @param {string|string[]} options.to          - Recipient(s)
 * @param {string}           options.subject    - Email subject
 * @param {string}           [options.html]     - HTML body
 * @param {string}           [options.text]     - Plain-text fallback body
 * @param {string}           [options.from]     - Sender (defaults to MAIL_FROM env)
 * @param {string|string[]}  [options.cc]       - CC recipients
 * @param {string|string[]}  [options.bcc]      - BCC recipients
 * @param {Array}            [options.attachments] - Nodemailer attachment objects
 * @returns {Promise<object>} Nodemailer info object
 */
const sendEmail = async ({ to, subject, html, text, from, cc, bcc, attachments }) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: from || `"${process.env.MAIL_FROM_NAME || 'App'}" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
    to,
    subject,
    ...(html && { html }),
    ...(text && { text }),
    ...(cc && { cc }),
    ...(bcc && { bcc }),
    ...(attachments && { attachments }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId} → ${to}`);
    return info;
  } catch (err) {
    logger.error(`Email send error to ${to}:`, err);
    throw err;
  }
};

/**
 * Send a templated email using a pre-built HTML template string.
 *
 * @param {object} options
 * @param {string|string[]} options.to
 * @param {string}           options.subject
 * @param {string}           options.template  - HTML string from a template file
 * @param {object}           [options.extras]  - Additional sendEmail options
 * @returns {Promise<object>}
 */
const sendTemplateEmail = async ({ to, subject, template, ...extras }) => {
  return sendEmail({ to, subject, html: template, ...extras });
};

/**
 * Send a bulk email to multiple recipients individually (no reply-all exposure).
 *
 * @param {string[]} recipients - Array of email addresses
 * @param {string}   subject
 * @param {string}   html
 * @param {Function} [templateFn] - Optional fn(email) => html for personalised content
 * @returns {Promise<PromiseSettledResult[]>}
 */
const sendBulkEmail = async (recipients, subject, html, templateFn = null) => {
  const promises = recipients.map((email) => {
    const body = templateFn ? templateFn(email) : html;
    return sendEmail({ to: email, subject, html: body });
  });
  return Promise.allSettled(promises);
};

/**
 * Verify the SMTP connection (useful on startup).
 * @returns {Promise<boolean>}
 */
const verifyMailConnection = async () => {
  try {
    await getTransporter().verify();
    logger.info('Mail transporter is ready');
    return true;
  } catch (err) {
    logger.warn('Mail transporter verification failed:', err.message);
    return false;
  }
};

export  {
  sendEmail,
  sendTemplateEmail,
  sendBulkEmail,
  verifyMailConnection,
};