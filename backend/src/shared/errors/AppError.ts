/**
 * Application Error Classes
 * 
 * Custom error classes for better error handling and type safety.
 * All errors extend from AppError to provide consistent error structure.
 */

import { ErrorCode } from '../types';

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error - 400
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.VALIDATION_ERROR, 400);
  }
}

/**
 * Rate limit error - 429
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429);
  }
}

/**
 * Gemini API error - 502
 */
export class GeminiApiError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(
      `Gemini API Error: ${message}`,
      ErrorCode.GEMINI_API_ERROR,
      502
    );
    if (originalError) {
      this.cause = originalError;
    }
  }
}

/**
 * Internal server error - 500
 */
export class InternalError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, ErrorCode.INTERNAL_ERROR, 500, false);
    if (originalError) {
      this.cause = originalError;
    }
  }
}

/**
 * Unauthorized error - 401
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, ErrorCode.UNAUTHORIZED, 401);
  }
}

/**
 * Not found error - 404
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, ErrorCode.NOT_FOUND, 404);
  }
}

