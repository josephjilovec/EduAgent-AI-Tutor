/**
 * Frontend Type Definitions
 * 
 * Type definitions for the frontend application.
 */

export enum AgentPersona {
  EXPLAINER = 'explainer',
  EXAMPLE_PROVIDER = 'example_provider'
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentPersona?: AgentPersona;
}

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

export interface ApiResponse {
  success: boolean;
  responses: ChatResponse[];
}

export interface ApiError {
  error: string;
  message: string;
  timestamp: Date;
  code?: string;
}

