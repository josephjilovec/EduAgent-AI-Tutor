/**
 * Configuration Management
 * 
 * Centralized configuration with environment variable validation.
 * Uses Zod for runtime type checking and validation.
 */

import dotenv from 'dotenv';
import { z } from 'zod';
import { AppConfig } from '../types';

// Load environment variables
dotenv.config();

/**
 * Environment variable schema validation
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().default('gemini-2.0-flash-exp'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/).transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().regex(/^\d+$/).transform(Number).default('100'),
  MAX_MESSAGE_LENGTH: z.string().regex(/^\d+$/).transform(Number).default('5000'),
  MAX_CONVERSATION_HISTORY: z.string().regex(/^\d+$/).transform(Number).default('50'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_DIR: z.string().default('./logs')
});

/**
 * Validates and loads configuration from environment variables
 */
class Config {
  private config: AppConfig;

  constructor() {
    try {
      const env = envSchema.parse(process.env);
      this.config = {
        port: env.PORT,
        nodeEnv: env.NODE_ENV,
        geminiApiKey: env.GEMINI_API_KEY,
        geminiModel: env.GEMINI_MODEL,
        corsOrigin: env.CORS_ORIGIN,
        rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
        rateLimitMaxRequests: env.RATE_LIMIT_MAX_REQUESTS,
        maxMessageLength: env.MAX_MESSAGE_LENGTH,
        maxConversationHistory: env.MAX_CONVERSATION_HISTORY,
        logLevel: env.LOG_LEVEL,
        logDir: env.LOG_DIR
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join('\n');
        throw new Error(`Configuration validation failed:\n${errorMessages}`);
      }
      throw error;
    }
  }

  /**
   * Get the complete configuration object
   */
  getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Get a specific configuration value
   */
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  /**
   * Check if running in test
   */
  isTest(): boolean {
    return this.config.nodeEnv === 'test';
  }
}

// Singleton instance
let configInstance: Config | null = null;

/**
 * Initialize and get configuration instance
 */
export function getConfig(): Config {
  if (!configInstance) {
    configInstance = new Config();
  }
  return configInstance;
}

export default Config;

