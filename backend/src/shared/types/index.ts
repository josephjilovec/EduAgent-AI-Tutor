/**
 * Shared Type Definitions
 * 
 * This file contains common type definitions used across the application.
 * Following Clean Architecture, these types are part of the shared layer
 * and can be used by any layer.
 */

/**
 * Agent persona types for the multi-agent tutoring system
 */
export enum AgentPersona {
  EXPLAINER = 'explainer',
  EXAMPLE_PROVIDER = 'example_provider'
}

/**
 * Message role in a conversation
 */
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: Date;
  agentPersona?: AgentPersona;
}

/**
 * Conversation context
 */
export interface ConversationContext {
  messages: ChatMessage[];
  subject?: string;
  topic?: string;
  userId?: string;
}

/**
 * API Request/Response types
 */
export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  subject?: string;
  topic?: string;
}

export interface ChatResponse {
  message: string;
  agentPersona: AgentPersona;
  timestamp: Date;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: Date;
  code?: string;
}

/**
 * Application configuration
 */
export interface AppConfig {
  port: number;
  nodeEnv: string;
  geminiApiKey: string;
  geminiModel: string;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  maxMessageLength: number;
  maxConversationHistory: number;
  logLevel: string;
  logDir: string;
}

/**
 * Logger levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

/**
 * API Error codes
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  GEMINI_API_ERROR = 'GEMINI_API_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND'
}

