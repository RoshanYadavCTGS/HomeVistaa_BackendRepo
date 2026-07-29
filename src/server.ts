import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';
import http from 'http';

const server = http.createServer(app);

async function start(): Promise<void> {
  try {
    // 1. Connect to database
    await connectDatabase();

    // 2. Start server
    server.listen(env.PORT, () => {
      logger.info(`🚀 HomeVistaa API running on port ${env.PORT}`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
      logger.info(`📡 API Prefix: /api/v1`);
      logger.info(`📁 Upload Dir: ${env.UPLOAD_DIR}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────

function shutdown(signal: string): void {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed');
    await disconnectDatabase();
    logger.info('Shutdown complete');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  shutdown('uncaughtException');
});

start();
