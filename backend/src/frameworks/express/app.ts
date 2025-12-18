/**
 * Express Application Setup
 * 
 * Configures Express application with all middleware, routes, and error handling.
 * This is the framework/driver layer that wires everything together.
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import chatRoutes from './routes/chatRoutes';
import { getConfig } from '../../shared/config/Config';
import { getLogger } from '../../shared/logger/Logger';
import { NotFoundError } from '../../shared/errors/AppError';

/**
 * Create and configure Express application
 * 
 * @returns Configured Express application
 */
export function createApp(): Application {
  const app = express();
  const config = getConfig();
  const logger = getLogger();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // CORS configuration
  app.use(cors({
    origin: config.get('corsOrigin'),
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.get('rateLimitWindowMs'),
    max: config.get('rateLimitMaxRequests'),
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use('/api/', limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression middleware
  app.use(compression());

  // Logging middleware
  if (config.isDevelopment()) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim())
      }
    }));
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.get('nodeEnv')
    });
  });

  // API routes
  app.use('/api/chat', chatRoutes);

  // 404 handler for unknown routes
  app.use((req, res, next) => {
    throw new NotFoundError(`Route ${req.method} ${req.path} not found`);
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  logger.info('Express application configured', {
    environment: config.get('nodeEnv'),
    port: config.get('port')
  });

  return app;
}

