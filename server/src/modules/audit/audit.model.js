import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
      enum: [
        'CREATE',
        'UPDATE',
        'DELETE',
        'LOGIN',
        'LOGOUT',
        'LOGIN_FAILED',
        'PASSWORD_CHANGE',
        'PASSWORD_RESET',
        'ROLE_ASSIGN',
        'PERMISSION_CHANGE',
        'EXPORT',
        'IMPORT',
        'APPROVE',
        'REJECT',
        'REFUND',
        'STATUS_CHANGE',
      ],
    },

    resource: {
      type: String,
      required: true,
      trim: true,
      index: true,
      // e.g. 'Product', 'Order', 'User', 'Coupon'
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    // State before the change
    oldData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // State after the change
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },

    userAgent: {
      type: String,
      trim: true,
      default: null,
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
      index: true,
    },

    note: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    // Audit logs are append-only; disable updates at schema level
    strict: true,
  }
);

// ── Compound indexes for common query patterns ─────────────────────────────────

// Filter by store + resource + action (admin audit views)
auditLogSchema.index({ store: 1, resource: 1, action: 1 });

// Filter by who did what and when
auditLogSchema.index({ performedBy: 1, createdAt: -1 });

// Filter by resource + resourceId (e.g. full history of one product)
auditLogSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });

// TTL index: auto-delete audit logs older than 1 year (365 days)
auditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 365 }
);

// ── Statics ────────────────────────────────────────────────────────────────────

/**
 * Get audit history for a specific resource document.
 *
 * @param {string} resource - Resource name e.g. 'Product'
 * @param {string|ObjectId} resourceId
 * @param {number} [limit=20]
 */
auditLogSchema.statics.getHistory = function (resource, resourceId, limit = 20) {
  return this.find({ resource, resourceId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('performedBy', 'name email');
};

/**
 * Get recent activity for a specific user.
 *
 * @param {string|ObjectId} userId
 * @param {number} [limit=50]
 */
auditLogSchema.statics.getActivityByUser = function (userId, limit = 50) {
  return this.find({ performedBy: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get recent activity for a store.
 *
 * @param {string|ObjectId} storeId
 * @param {number} [limit=100]
 */
auditLogSchema.statics.getActivityByStore = function (storeId, limit = 100) {
  return this.find({ store: storeId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('performedBy', 'name email');
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;