/**
 * Gemini Service Implementation
 * 
 * Concrete implementation of IGeminiService using Google Gemini API.
 * This is the outermost layer - framework/driver implementation.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { IGeminiService } from '../../adapters/interfaces/IGeminiService';
import { GeminiApiError } from '../../shared/errors/AppError';
import { getLogger } from '../../shared/logger/Logger';
import { getConfig } from '../../shared/config/Config';

/**
 * Gemini API service implementation
 * 
 * Handles all interactions with Google Gemini API including
 * error handling, retries, and response parsing.
 */
export class GeminiService implements IGeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;
  private readonly logger = getLogger();
  private readonly config = getConfig();
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // milliseconds

  constructor() {
    const apiKey = this.config.get('geminiApiKey');
    const modelName = this.config.get('geminiModel');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });

    this.logger.info('GeminiService initialized', { model: modelName });
  }

  /**
   * Generate a response from Gemini API with retry logic
   * 
   * @param prompt - The prompt/question to send
   * @param history - Optional conversation history
   * @returns Promise resolving to the generated response text
   * @throws {GeminiApiError} If API call fails after retries
   */
  async generateResponse(
    prompt: string,
    history: Array<{ role: string; parts: Array<{ text: string }> }> = []
  ): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.debug('Calling Gemini API', { attempt, promptLength: prompt.length });

        // Build chat session if history exists
        if (history.length > 0) {
          const chat = this.model.startChat({ history });
          const result = await chat.sendMessage(prompt);
          const response = await result.response;
          const text = response.text();

          this.logger.debug('Gemini API response received', { 
            attempt, 
            responseLength: text.length 
          });

          return text;
        } else {
          // Single prompt without history
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          this.logger.debug('Gemini API response received', { 
            attempt, 
            responseLength: text.length 
          });

          return text;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        this.logger.warn('Gemini API call failed', { 
          attempt, 
          error: lastError.message,
          willRetry: attempt < this.maxRetries
        });

        // Don't retry on certain errors (e.g., invalid API key, quota exceeded)
        if (this.isNonRetryableError(error)) {
          throw new GeminiApiError(
            `Non-retryable error: ${lastError.message}`,
            lastError
          );
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    // All retries exhausted
    throw new GeminiApiError(
      `Failed to generate response after ${this.maxRetries} attempts: ${lastError?.message || 'Unknown error'}`,
      lastError || undefined
    );
  }

  /**
   * Check if error is non-retryable
   * 
   * @param error - Error to check
   * @returns True if error should not be retried
   */
  private isNonRetryableError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    const message = error.message.toLowerCase();
    const nonRetryablePatterns = [
      'api key',
      'authentication',
      'unauthorized',
      'quota',
      'billing',
      'invalid'
    ];

    return nonRetryablePatterns.some(pattern => message.includes(pattern));
  }

  /**
   * Delay execution
   * 
   * @param ms - Milliseconds to delay
   * @returns Promise that resolves after delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

