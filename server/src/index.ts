import { createApp, errorHandler, notFoundHandler } from './config/app';
import { environment } from './config/environment';
import { logger } from './core/logger';
import { db } from './core/database/connection';
import { moduleLoader } from './modules/_loader';
import apiV1Router from './api/v1';
import path from 'path';

async function bootstrap(): Promise<void> {
  const app = createApp();

  try {
    // Test database connection
    logger.info('Đang kết nối database...');
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Không thể kết nối database');
    }

    // Load all modules
    logger.info('Đang load các modules...');
    const modulesDir = path.join(__dirname, 'modules');
    await moduleLoader.loadAllModules(modulesDir);

    // Register API routes
    app.use('/api/v1', apiV1Router);
    moduleLoader.registerRoutes(apiV1Router);

    // Error handlers (must be last)
    app.use(notFoundHandler);
    app.use(errorHandler);

    // Start server
    app.listen(environment.port, () => {
      logger.info('='.repeat(50));
      logger.info(`🚀 ERP Tiểu Đoàn Server đang chạy`);
      logger.info(`   Environment: ${environment.nodeEnv}`);
      logger.info(`   Port: ${environment.port}`);
      logger.info(`   API: http://localhost:${environment.port}/api/v1`);
      logger.info(`   Health: http://localhost:${environment.port}/health`);
      logger.info('='.repeat(50));
    });

  } catch (error) {
    logger.error('Không thể khởi động server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Đang tắt server...');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Đang tắt server...');
  await db.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
bootstrap();
