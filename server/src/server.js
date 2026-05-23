"use strict";

// const http = require("http");
import http from "http";
// const app = require("./app");
import {app }from "./app.js"

// const { connectDB } = require("./src/config/db");
import connectDB from "./config/db.js"
// const { connectRedis } = require("./src/config/redis");
// const { initSocket } = require("./src/config/socket");
// const { runBootstrap } = require("./src/bootstrap/index");
import {runBootstrap} from "../src/bootstrap/index.js"
import {logger} from "./config/logger.js";
// const logger = require("./src/config/logger");

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// ══════════════════════════════════════════════════════════════════════════════
// Bootstrap & start
// ══════════════════════════════════════════════════════════════════════════════
async function start() {
  try {
    // 1. Connect MongoDB
    await connectDB();
    logger.info("MongoDB connected");

    // 2. Connect Redis (non-fatal — rate limiter falls back to memory)
    try {
      await connectRedis();
      logger.info("Redis connected");
    } catch (err) {
      logger.warn(`Redis unavailable — falling back to in-memory store: ${err.message}`);
    }

    // 3. Run one-time bootstrap tasks (superadmin seed, permissions, roles)
    await runBootstrap();
    logger.info("Bootstrap complete");

    // 4. Create HTTP server
    const server = http.createServer(app);

    // 5. Attach Socket.IO
    // initSocket(server);
    logger.info("Socket.IO initialised");

    // 6. Listen
    server.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT} [${process.env.NODE_ENV}]`);
    });

    // ── Graceful shutdown ────────────────────────────────────────────────────
    const shutdown = async (signal) => {
      logger.info(`${signal} received — gracefully shutting down`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          const mongoose = require("mongoose");
          await mongoose.connection.close();
          logger.info("MongoDB connection closed");
        } catch (err) {
          logger.error(`Error closing MongoDB: ${err.message}`);
        }

        try {
          const { redisClient } = require("./src/config/redis");
          if (redisClient?.isReady) {
            await redisClient.quit();
            logger.info("Redis connection closed");
          }
        } catch (err) {
          logger.error(`Error closing Redis: ${err.message}`);
        }

        logger.info("Shutdown complete");
        process.exit(0);
      });

      // Force exit after 15 s
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 15_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT",  () => shutdown("SIGINT"));

    // ── Unhandled rejections / exceptions ────────────────────────────────────
    process.on("unhandledRejection", (reason) => {
      logger.error(`Unhandled Rejection: ${reason}`);
      shutdown("unhandledRejection");
    });

    process.on("uncaughtException", (err) => {
      logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
      shutdown("uncaughtException");
    });

    return server;
  } catch (err) {
    logger.error(`Fatal startup error: ${err.message}`, { stack: err.stack });
    process.exit(1);
  }
}

start();