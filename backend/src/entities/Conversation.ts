/**
 * Conversation Entity
 * 
 * Core business entity representing a conversation between user and AI agents.
 * Manages conversation state and enforces business rules.
 */

import { Message } from './Message';
import { MessageRole, AgentPersona } from '../shared/types';

/**
 * Conversation entity class
 * 
 * Manages a collection of messages with validation and business rules.
 */
export class Conversation {
  private readonly _messages: Message[];
  private readonly _subject?: string;
  private readonly _topic?: string;
  private readonly _userId?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  /**
   * Creates a new Conversation entity
   * 
   * @param messages - Initial messages (optional)
   * @param subject - Subject being taught (optional)
   * @param topic - Specific topic (optional)
   * @param userId - User identifier (optional)
   */
  constructor(
    messages: Message[] = [],
    subject?: string,
    topic?: string,
    userId?: string
  ) {
    this._messages = [...messages];
    this._subject = subject;
    this._topic = topic;
    this._userId = userId;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Add a message to the conversation
   * 
   * @param message - Message to add
   * @throws {Error} If message is invalid or conversation is at capacity
   */
  addMessage(message: Message): void {
    this.validateMessageAddition(message);
    this._messages.push(message);
    this._updatedAt = new Date();
  }

  /**
   * Validate message can be added
   * 
   * @param message - Message to validate
   * @throws {Error} If validation fails
   */
  private validateMessageAddition(message: Message): void {
    // Check conversation history limit (configurable, default 50)
    const maxHistory = 100; // Can be injected via config
    if (this._messages.length >= maxHistory) {
      throw new Error(`Conversation history limit of ${maxHistory} messages reached`);
    }
  }

  /**
   * Get all messages
   */
  get messages(): Message[] {
    return [...this._messages];
  }

  /**
   * Get conversation subject
   */
  get subject(): string | undefined {
    return this._subject;
  }

  /**
   * Get conversation topic
   */
  get topic(): string | undefined {
    return this._topic;
  }

  /**
   * Get user ID
   */
  get userId(): string | undefined {
    return this._userId;
  }

  /**
   * Get creation timestamp
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Get last update timestamp
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Get recent messages (last N messages)
   * 
   * @param count - Number of recent messages to retrieve
   * @returns Array of recent messages
   */
  getRecentMessages(count: number): Message[] {
    return this._messages.slice(-count);
  }

  /**
   * Get messages formatted for Gemini API
   * 
   * @returns Array of message objects in Gemini format
   */
  getGeminiFormat(): Array<{ role: string; parts: Array<{ text: string }> }> {
    return this._messages.map(msg => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
  }

  /**
   * Convert conversation to plain object
   */
  toJSON(): {
    messages: ReturnType<Message['toJSON']>[];
    subject?: string;
    topic?: string;
    userId?: string;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      messages: this._messages.map(msg => msg.toJSON()),
      ...(this._subject && { subject: this._subject }),
      ...(this._topic && { topic: this._topic }),
      ...(this._userId && { userId: this._userId }),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString()
    };
  }
}

