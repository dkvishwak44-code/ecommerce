"use strict";

// const express = require("express");
import express from "express";
// const helmet = require("helmet");
import helmet from "helmet";

// const cors = require("cors");
import cors from "cors";

// const morgan = require("morgan");
import morgan from "morgan";
// const cookieParser = require("cookie-parser");
import cookieParser from "cookie-parser";
// const compression = require("compression");
import compression from "compression";
// const mongoSanitize = require("express-mongo-sanitize");
// import mongoSanitize from "express-mongo-sanitize";
// const { rateLimit } = require("express-rate-limit");
import rateLimit from "express-rate-limit";
// import logger from "./config/logger";

// import {errorMiddleware} from "./middleware/validate.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { logger } from "./config/logger.js";
import { errorMiddleware } from "./middleware/validate.middleware.js";
import clientRoutes from "./api/client/routes.js";

// const logger = require("./src/config/logger");

// const { errorMiddleware } = require("./src/middleware/error.middleware");
// const { notFoundMiddleware } = require("./src/middleware/notFound.middleware");

// ── Route barrels ─────────────────────────────────────────────────────────────
// const {adminRoutes} = require("./src/api/admin/routes.js");
import adminRoutes from "./api/admin/routes.js"

// const clientRoutes = require("./src/api/client/routes");
// import{ clientRoutes} from "./api/client/routes.js"


const app = express();

// ══════════════════════════════════════════════════════════════════════════════
// 1. Trust proxy (needed for correct IP behind Nginx / load balancer)
// ══════════════════════════════════════════════════════════════════════════════
app.set("trust proxy", 1);

// ══════════════════════════════════════════════════════════════════════════════
// 2. Security headers
// ══════════════════════════════════════════════════════════════════════════════
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // relax if serving assets to browser
    contentSecurityPolicy: process.env.NODE_ENV === "production",
  })
);

// ══════════════════════════════════════════════════════════════════════════════
// 3. CORS
// ══════════════════════════════════════════════════════════════════════════════
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true, // required for httpOnly cookie (refresh token)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    exposedHeaders: ["X-Request-ID"],
  })
);

// ══════════════════════════════════════════════════════════════════════════════
// 4. Global rate limit (very permissive — per-route limits are tighter)
// ══════════════════════════════════════════════════════════════════════════════
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please slow down." },
  })
);

// ══════════════════════════════════════════════════════════════════════════════
// 5. Body parsers & cookies
// ══════════════════════════════════════════════════════════════════════════════
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ══════════════════════════════════════════════════════════════════════════════
// 6. Sanitise MongoDB operators in req.body / req.params / req.query
// ══════════════════════════════════════════════════════════════════════════════
// // app.use(mongoSanitize());
// app.use(
//   mongoSanitize({
//     replaceWith: "_",
//   })
// );

// ══════════════════════════════════════════════════════════════════════════════
// 7. Compression
// ══════════════════════════════════════════════════════════════════════════════
app.use(compression());

// ══════════════════════════════════════════════════════════════════════════════
// 8. HTTP request logging
// ══════════════════════════════════════════════════════════════════════════════
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.http(msg.trim()) },
      skip: (req) => req.url === "/health",
    })
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 9. Attach a unique request ID for tracing
// ══════════════════════════════════════════════════════════════════════════════
app.use((req, res, next) => {
  const id = req.headers["x-request-id"] || crypto.randomUUID();
  req.requestId = id;
  res.setHeader("X-Request-ID", id);
  next();
});

// ══════════════════════════════════════════════════════════════════════════════
// 10. Health check (no auth, no logging)
// ══════════════════════════════════════════════════════════════════════════════
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 11. API routes
// ══════════════════════════════════════════════════════════════════════════════
app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);

// ══════════════════════════════════════════════════════════════════════════════
// 12. 404 handler
// ══════════════════════════════════════════════════════════════════════════════
app.use(notFoundMiddleware);

// ══════════════════════════════════════════════════════════════════════════════
// 13. Global error handler (must be last)
// ══════════════════════════════════════════════════════════════════════════════
app.use(errorMiddleware);
export {app};