/**
 * Global Error Handler Middleware
 * 
 * Centralized error handling for Express application.
 * Catches all errors and returns consistent error responses.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';
import { getLogger } from '../../../shared/logger/Logger';
import { ErrorResponse } from '../../../shared/types';

/**
 * Global error handler middleware
 * 
 * Catches all errors and formats them into consistent error responses.
 * Logs errors appropriately based on their type.
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const logger = getLogger();

  // Log error
  if (error instanceof AppError) {
    if (error.isOperational) {
      logger.warn('Operational error', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        path: req.path,
        method: req.method
      });
    } else {
      logger.error('Non-operational error', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
        path: req.path,
        method: req.method
      });
    }
  } else {
    // Unexpected error
    logger.error('Unexpected error', {
      message: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method
    });
  }

  // Determine status code and error response
  let statusCode = 500;
  let errorResponse: ErrorResponse;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorResponse = {
      error: error.code,
      message: error.message,
      timestamp: new Date()
    };
  } else {
    // Unknown error - don't leak internal details in production
    const isProduction = process.env.NODE_ENV === 'production';
    errorResponse = {
      error: 'INTERNAL_ERROR',
      message: isProduction
        ? 'An internal server error occurred'
        : error.message,
      timestamp: new Date()
    };
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * Async error wrapper
 * 
 * Wraps async route handlers to catch errors and pass them to error handler
 * 
 * @param fn - Async route handler function
 * @returns Wrapped function
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

