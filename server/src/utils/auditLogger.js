    // const AuditLog = require('../modules/audit/audit.model');
    import { logger } from "../config/logger.js";
     import AuditLog from "../modules/audit/audit.model.js"
    // const logger = require('../config/logger');
    logger

/**
 * Actions enum for audit log entries.
 */
const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  ROLE_ASSIGN: 'ROLE_ASSIGN',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  REFUND: 'REFUND',
  STATUS_CHANGE: 'STATUS_CHANGE',
};

/**
 * Creates an audit log entry in the database.
 *
 * @param {object} options
 * @param {string|import('mongoose').Types.ObjectId} options.performedBy - User ID who performed the action
 * @param {string} options.action - Action type (use AUDIT_ACTIONS constants)
 * @param {string} options.resource - Resource/module name (e.g., 'Product', 'Order')
 * @param {string|import('mongoose').Types.ObjectId} [options.resourceId] - ID of the affected resource
 * @param {object} [options.oldData] - State before the change
 * @param {object} [options.newData] - State after the change
 * @param {string} [options.ipAddress] - Client IP address
 * @param {string} [options.userAgent] - Client User-Agent string
 * @param {string} [options.store] - Store ID for multi-tenant context
 * @param {string} [options.note] - Optional human-readable note
 * @returns {Promise<void>}
 */
const logAudit = async ({
  performedBy,
  action,
  resource,
  resourceId = null,
  oldData = null,
  newData = null,
  ipAddress = null,
  userAgent = null,
  store = null,
  note = null,
}) => {
  try {
    await AuditLog.create({
      performedBy,
      action,
      resource,
      resourceId,
      oldData,
      newData,
      ipAddress,
      userAgent,
      store,
      note,
    });
  } catch (err) {
    // Audit logging must never break the main request flow
    logger.error('AuditLogger error:', err);
  }
};

/**
 * Extract audit context (IP and User-Agent) from an Express request object.
 *
 * @param {import('express').Request} req
 * @returns {{ ipAddress: string, userAgent: string }}
 */
const extractRequestContext = (req) => ({
  ipAddress:
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    null,
  userAgent: req.headers['user-agent'] || null,
});

/**
 * Build a diff object showing only changed fields between two plain objects.
 *
 * @param {object} oldObj
 * @param {object} newObj
 * @returns {{ before: object, after: object }}
 */
const diffObjects = (oldObj, newObj) => {
  const before = {};
  const after = {};

  const allKeys = new Set([
    ...Object.keys(oldObj || {}),
    ...Object.keys(newObj || {}),
  ]);

  allKeys.forEach((key) => {
    const oldVal = oldObj?.[key];
    const newVal = newObj?.[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      before[key] = oldVal;
      after[key] = newVal;
    }
  });

  return { before, after };
};

export default {
  logAudit,
  extractRequestContext,
  diffObjects,
  AUDIT_ACTIONS,
};

// Provide named exports for compatibility with named imports
export { logAudit as auditLog, extractRequestContext, diffObjects, AUDIT_ACTIONS };
