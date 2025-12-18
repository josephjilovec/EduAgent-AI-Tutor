/**
 * Application Entry Point
 * 
 * Initializes the application, loads configuration, sets up logging,
 * and starts the Express server.
 */

import { createApp } from './frameworks/express/app';
import { getConfig } from './shared/config/Config';
import { initializeLogger } from './shared/logger/Logger';
import { getLogger } from './shared/logger/Logger';

/**
 * Main application initialization and startup
 */
async function main(): Promise<void> {
  try {
    // Initialize configuration (validates environment variables)
    const config = getConfig();

    // Initialize logger
    initializeLogger(config.get('logDir'), config.get('logLevel'));
    const logger = getLogger();

    logger.info('Starting EduAgent AI Tutor Backend', {
      nodeEnv: config.get('nodeEnv'),
      port: config.get('port')
    });

    // Create Express application
    const app = createApp();

    // Start server
    const port = config.get('port');
    app.listen(port, () => {
      logger.info(`Server started successfully`, {
        port,
        environment: config.get('nodeEnv'),
        timestamp: new Date().toISOString()
      });
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      process.exit(0);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled promise rejection', { reason });
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
main().catch((error) => {
  console.error('Fatal error during startup:', error);
  process.exit(1);
});

