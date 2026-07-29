"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app_1.default);
async function start() {
    try {
        // 1. Connect to database
        await (0, database_1.connectDatabase)();
        // 2. Start server
        server.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`🚀 HomeVistaa API running on port ${env_1.env.PORT}`);
            logger_1.logger.info(`🌍 Environment: ${env_1.env.NODE_ENV}`);
            logger_1.logger.info(`📡 API Prefix: /api/v1`);
            logger_1.logger.info(`📁 Upload Dir: ${env_1.env.UPLOAD_DIR}`);
        });
    }
    catch (err) {
        logger_1.logger.error('Failed to start server:', err);
        process.exit(1);
    }
}
// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
function shutdown(signal) {
    logger_1.logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        logger_1.logger.info('HTTP server closed');
        await (0, database_1.disconnectDatabase)();
        logger_1.logger.info('Shutdown complete');
        process.exit(0);
    });
    // Force exit after 10 seconds
    setTimeout(() => {
        logger_1.logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
    logger_1.logger.error('Uncaught exception:', err);
    shutdown('uncaughtException');
});
start();
//# sourceMappingURL=server.js.map