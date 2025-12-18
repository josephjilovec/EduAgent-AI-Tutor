/**
 * Message Entity
 * 
 * Core business entity representing a chat message.
 * This is the innermost layer of Clean Architecture - pure business logic.
 */

import { MessageRole, AgentPersona } from '../shared/types';

/**
 * Message entity class
 * 
 * Represents a single message in a conversation with validation
 * and business rules enforced at the entity level.
 */
export class Message {
  private readonly _role: MessageRole;
  private readonly _content: string;
  private readonly _timestamp: Date;
  private readonly _agentPersona?: AgentPersona;

  /**
   * Creates a new Message entity
   * 
   * @param role - The role of the message sender
   * @param content - The message content (validated)
   * @param timestamp - When the message was created
   * @param agentPersona - Optional agent persona for assistant messages
   * @throws {Error} If content is empty or exceeds maximum length
   */
  constructor(
    role: MessageRole,
    content: string,
    timestamp: Date = new Date(),
    agentPersona?: AgentPersona
  ) {
    this.validateContent(content);
    this._role = role;
    this._content = content.trim();
    this._timestamp = timestamp;
    this._agentPersona = agentPersona;
  }

  /**
   * Validates message content
   * 
   * @param content - Content to validate
   * @throws {Error} If content is invalid
   */
  private validateContent(content: string): void {
    if (!content || typeof content !== 'string') {
      throw new Error('Message content must be a non-empty string');
    }

    const trimmed = content.trim();
    if (trimmed.length === 0) {
      throw new Error('Message content cannot be empty');
    }

    // Maximum length validation (configurable, default 5000)
    const maxLength = 10000; // Can be injected via config if needed
    if (trimmed.length > maxLength) {
      throw new Error(`Message content exceeds maximum length of ${maxLength} characters`);
    }
  }

  /**
   * Get message role
   */
  get role(): MessageRole {
    return this._role;
  }

  /**
   * Get message content
   */
  get content(): string {
    return this._content;
  }

  /**
   * Get message timestamp
   */
  get timestamp(): Date {
    return this._timestamp;
  }

  /**
   * Get agent persona (if applicable)
   */
  get agentPersona(): AgentPersona | undefined {
    return this._agentPersona;
  }

  /**
   * Convert message to plain object for serialization
   */
  toJSON(): {
    role: MessageRole;
    content: string;
    timestamp: string;
    agentPersona?: AgentPersona;
  } {
    return {
      role: this._role,
      content: this._content,
      timestamp: this._timestamp.toISOString(),
      ...(this._agentPersona && { agentPersona: this._agentPersona })
    };
  }

  /**
   * Create Message from plain object
   * 
   * @param data - Plain object data
   * @returns New Message instance
   */
  static fromJSON(data: {
    role: MessageRole;
    content: string;
    timestamp?: string | Date;
    agentPersona?: AgentPersona;
  }): Message {
    const timestamp = data.timestamp
      ? typeof data.timestamp === 'string'
        ? new Date(data.timestamp)
        : data.timestamp
      : new Date();

    return new Message(
      data.role,
      data.content,
      timestamp,
      data.agentPersona
    );
  }
}

