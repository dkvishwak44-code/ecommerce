// const { createLogger, format, transports } = require('winston');
import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

const { combine, timestamp, printf, colorize, errors, json, splat } = format;

// ── Ensure logs directory exists ───────────────────────────────────────────────
const LOG_DIR = path.join(process.cwd(), 'logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

const isProduction = process.env.NODE_ENV === 'production';

// ── Custom console format (dev) ────────────────────────────────────────────────
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});

// ── Transport: Console ─────────────────────────────────────────────────────────
const consoleTransport = new transports.Console({
  level: isProduction ? 'warn' : 'debug',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    splat(),
    consoleFormat
  ),
});

// ── Transport: Combined log file ───────────────────────────────────────────────
const fileTransportCombined = new transports.File({
  filename: path.join(LOG_DIR, 'combined.log'),
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    splat(),
    json()
  ),
  maxsize: 10 * 1024 * 1024, // 10 MB
  maxFiles: 5,
  tailable: true,
});

// ── Transport: Error log file ──────────────────────────────────────────────────
const fileTransportError = new transports.File({
  filename: path.join(LOG_DIR, 'error.log'),
  level: 'error',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    splat(),
    json()
  ),
  maxsize: 10 * 1024 * 1024, // 10 MB
  maxFiles: 5,
  tailable: true,
});

// ── Create Logger ──────────────────────────────────────────────────────────────
const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  defaultMeta: { service: process.env.APP_NAME || 'app' },
  transports: [
    consoleTransport,
    fileTransportCombined,
    fileTransportError,
  ],
  // Do not exit on handled exceptions
  exitOnError: false,
});

// ── Unhandled exception / rejection logging ────────────────────────────────────
if (isProduction) {
  logger.exceptions.handle(
    new transports.File({ filename: path.join(LOG_DIR, 'exceptions.log') })
  );
  logger.rejections.handle(
    new transports.File({ filename: path.join(LOG_DIR, 'rejections.log') })
  );
}

// ── Stream for Morgan HTTP logger middleware ───────────────────────────────────
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

export  {logger};