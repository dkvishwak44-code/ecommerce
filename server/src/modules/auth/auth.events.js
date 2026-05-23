// const EventEmitter = require("events");
// const logger = require("../../config/logger");
import { EventEmitter } from "events";
import {logger} from "../../config/logger.js";

const authEventEmitter = new EventEmitter();
authEventEmitter.setMaxListeners(20);

// ─── Event Definitions ────────────────────────────────────────────────────────
const AUTH_EVENTS = {
  LOGIN: "auth:login",
  LOGOUT: "auth:logout",
  LOGOUT_ALL: "auth:logout_all",
  FIRST_LOGIN: "auth:first_login",
  PASSWORD_CHANGED: "auth:password_changed",
  PASSWORD_CHANGED_FIRST_LOGIN: "auth:password_changed_first_login",
  PASSWORD_RESET: "auth:password_reset",
  ACCOUNT_LOCKED: "auth:account_locked",
};

// ─── Event Listeners ──────────────────────────────────────────────────────────

authEventEmitter.on(AUTH_EVENTS.LOGIN, ({ userId, ip }) => {
  logger.info(`[AUTH EVENT] Login | User: ${userId} | IP: ${ip}`);
  // Hook: push to audit log, analytics, etc.
});

authEventEmitter.on(AUTH_EVENTS.FIRST_LOGIN, ({ userId }) => {
  logger.info(`[AUTH EVENT] First Login | User: ${userId}`);
  // Hook: send welcome/setup email
});

authEventEmitter.on(AUTH_EVENTS.PASSWORD_CHANGED_FIRST_LOGIN, ({ userId }) => {
  logger.info(`[AUTH EVENT] First-Login Password Changed | User: ${userId}`);
  // Hook: send confirmation email, update audit trail
});

authEventEmitter.on(AUTH_EVENTS.PASSWORD_CHANGED, ({ userId }) => {
  logger.info(`[AUTH EVENT] Password Changed | User: ${userId}`);
  // Hook: send security alert email
});

authEventEmitter.on(AUTH_EVENTS.PASSWORD_RESET, ({ userId }) => {
  logger.info(`[AUTH EVENT] Password Reset | User: ${userId}`);
});

authEventEmitter.on(AUTH_EVENTS.ACCOUNT_LOCKED, ({ userId }) => {
  logger.warn(`[AUTH EVENT] Account Locked | User: ${userId}`);
  // Hook: alert admin, send unlock instructions to user
});

authEventEmitter.on(AUTH_EVENTS.LOGOUT, ({ userId }) => {
  logger.info(`[AUTH EVENT] Logout | User: ${userId}`);
});

authEventEmitter.on(AUTH_EVENTS.LOGOUT_ALL, ({ userId }) => {
  logger.info(`[AUTH EVENT] Logout All Sessions | User: ${userId}`);
});

// ─── Emitter Helper ───────────────────────────────────────────────────────────

function emitAuthEvent(event, data = {}) {
  authEventEmitter.emit(event, data);
}

export  { authEventEmitter, emitAuthEvent, AUTH_EVENTS };