/**
 * Logger Service
 * 
 * Production-ready logging implementation using Winston.
 * Provides structured logging with different levels, file rotation,
 * and proper error tracking.
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { LogLevel } from '../types';

/**
 * Logger configuration and setup
 */
class Logger {
  private logger: winston.Logger;
  private logDir: string;

  constructor(logDir: string = './logs', logLevel: string = 'info') {
    this.logDir = logDir;
    this.logger = this.createLogger(logLevel);
  }

  /**
   * Creates and configures Winston logger instance
   * 
   * @param logLevel - Minimum log level to output
   * @returns Configured Winston logger
   */
  private createLogger(logLevel: string): winston.Logger {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
          msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
      })
    );

    const logger = winston.createLogger({
      level: logLevel,
      format: logFormat,
      defaultMeta: { service: 'eduagent-backend' },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: consoleFormat,
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        }),
        // Error log file with rotation
        new DailyRotateFile({
          filename: path.join(this.logDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d',
          format: logFormat
        }),
        // Combined log file with rotation
        new DailyRotateFile({
          filename: path.join(this.logDir, 'combined-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: logFormat
        })
      ],
      exceptionHandlers: [
        new DailyRotateFile({
          filename: path.join(this.logDir, 'exceptions-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d'
        })
      ],
      rejectionHandlers: [
        new DailyRotateFile({
          filename: path.join(this.logDir, 'rejections-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d'
        })
      ]
    });

    return logger;
  }

  /**
   * Log error message
   */
  error(message: string, ...meta: unknown[]): void {
    this.logger.error(message, ...meta);
  }

  /**
   * Log warning message
   */
  warn(message: string, ...meta: unknown[]): void {
    this.logger.warn(message, ...meta);
  }

  /**
   * Log info message
   */
  info(message: string, ...meta: unknown[]): void {
    this.logger.info(message, ...meta);
  }

  /**
   * Log debug message
   */
  debug(message: string, ...meta: unknown[]): void {
    this.logger.debug(message, ...meta);
  }

  /**
   * Get the underlying Winston logger instance
   */
  getWinstonLogger(): winston.Logger {
    return this.logger;
  }
}

// Singleton instance
let loggerInstance: Logger | null = null;

/**
 * Initialize logger with configuration
 */
export function initializeLogger(logDir?: string, logLevel?: string): Logger {
  if (!loggerInstance) {
    loggerInstance = new Logger(logDir, logLevel);
  }
  return loggerInstance;
}

/**
 * Get logger instance (must be initialized first)
 */
export function getLogger(): Logger {
  if (!loggerInstance) {
    throw new Error('Logger not initialized. Call initializeLogger() first.');
  }
  return loggerInstance;
}

export default Logger;

