/**
 * Request Validation Middleware
 * 
 * Validates incoming requests using express-validator.
 * Ensures all required fields are present and properly formatted.
 */

import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../../shared/errors/AppError';

/**
 * Validation rules for chat request
 */
export const validateChatRequest: ValidationChain[] = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters'),
  
  body('conversationHistory')
    .optional()
    .isArray()
    .withMessage('Conversation history must be an array'),
  
  body('conversationHistory.*.role')
    .optional()
    .isIn(['user', 'assistant', 'system'])
    .withMessage('Invalid message role'),
  
  body('conversationHistory.*.content')
    .optional()
    .isString()
    .withMessage('Message content must be a string'),
  
  body('subject')
    .optional()
    .trim()
    .isString()
    .withMessage('Subject must be a string')
    .isLength({ max: 200 })
    .withMessage('Subject must not exceed 200 characters'),
  
  body('topic')
    .optional()
    .trim()
    .isString()
    .withMessage('Topic must be a string')
    .isLength({ max: 200 })
    .withMessage('Topic must not exceed 200 characters')
];

/**
 * Middleware to check validation results
 * 
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function checkValidation(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => {
      if ('msg' in err) {
        return `${err.path}: ${err.msg}`;
      }
      return `${err.path}: Invalid value`;
    }).join(', ');

    throw new ValidationError(errorMessages);
  }
  
  next();
}

