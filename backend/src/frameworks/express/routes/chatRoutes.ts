/**
 * Chat Routes
 * 
 * Express routes for chat-related endpoints.
 * Handles HTTP requests and delegates to use cases.
 */

import { Router, Request, Response } from 'express';
import { ChatUseCase } from '../../../usecases/ChatUseCase';
import { GeminiService } from '../../gemini/GeminiService';
import { validateChatRequest, checkValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { ChatRequest, ChatResponse } from '../../../shared/types';
import { getLogger } from '../../../shared/logger/Logger';

const router = Router();
const logger = getLogger();

// Initialize services (in production, use dependency injection container)
const geminiService = new GeminiService();
const chatUseCase = new ChatUseCase(geminiService);

/**
 * POST /api/chat
 * 
 * Process a chat message and return responses from AI agents
 */
router.post(
  '/',
  validateChatRequest,
  checkValidation,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const request: ChatRequest = {
      message: req.body.message,
      conversationHistory: req.body.conversationHistory,
      subject: req.body.subject,
      topic: req.body.topic
    };

    logger.info('Chat request received', {
      messageLength: request.message.length,
      hasHistory: !!request.conversationHistory,
      subject: request.subject,
      topic: request.topic
    });

    const responses: ChatResponse[] = await chatUseCase.execute(request);

    logger.info('Chat request processed successfully', {
      responseCount: responses.length
    });

    res.status(200).json({
      success: true,
      responses
    });
  })
);

/**
 * GET /api/chat/health
 * 
 * Health check endpoint for chat service
 */
router.get(
  '/health',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      status: 'healthy',
      service: 'chat',
      timestamp: new Date().toISOString()
    });
  })
);

export default router;

