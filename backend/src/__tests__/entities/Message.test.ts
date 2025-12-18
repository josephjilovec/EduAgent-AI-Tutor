/**
 * Message Entity Tests
 * 
 * Unit tests for the Message entity.
 */

import { Message } from '../../entities/Message';
import { MessageRole, AgentPersona } from '../../shared/types';

describe('Message Entity', () => {
  describe('Constructor', () => {
    it('should create a message with valid data', () => {
      const message = new Message(MessageRole.USER, 'Hello, world!');
      
      expect(message.role).toBe(MessageRole.USER);
      expect(message.content).toBe('Hello, world!');
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it('should trim whitespace from content', () => {
      const message = new Message(MessageRole.USER, '  Hello  ');
      
      expect(message.content).toBe('Hello');
    });

    it('should throw error for empty content', () => {
      expect(() => {
        new Message(MessageRole.USER, '');
      }).toThrow('Message content cannot be empty');
    });

    it('should throw error for content exceeding max length', () => {
      const longContent = 'a'.repeat(10001);
      
      expect(() => {
        new Message(MessageRole.USER, longContent);
      }).toThrow('Message content exceeds maximum length');
    });

    it('should accept agent persona for assistant messages', () => {
      const message = new Message(
        MessageRole.ASSISTANT,
        'This is an explanation',
        new Date(),
        AgentPersona.EXPLAINER
      );
      
      expect(message.agentPersona).toBe(AgentPersona.EXPLAINER);
    });
  });

  describe('toJSON', () => {
    it('should serialize message to JSON format', () => {
      const timestamp = new Date('2024-01-01T00:00:00Z');
      const message = new Message(
        MessageRole.ASSISTANT,
        'Test message',
        timestamp,
        AgentPersona.EXPLAINER
      );
      
      const json = message.toJSON();
      
      expect(json).toEqual({
        role: MessageRole.ASSISTANT,
        content: 'Test message',
        timestamp: timestamp.toISOString(),
        agentPersona: AgentPersona.EXPLAINER
      });
    });

    it('should not include agentPersona if not set', () => {
      const message = new Message(MessageRole.USER, 'Test');
      const json = message.toJSON();
      
      expect(json.agentPersona).toBeUndefined();
    });
  });

  describe('fromJSON', () => {
    it('should create message from JSON object', () => {
      const json = {
        role: MessageRole.USER,
        content: 'Test message',
        timestamp: '2024-01-01T00:00:00Z'
      };
      
      const message = Message.fromJSON(json);
      
      expect(message.role).toBe(MessageRole.USER);
      expect(message.content).toBe('Test message');
      expect(message.timestamp).toEqual(new Date('2024-01-01T00:00:00Z'));
    });

    it('should handle Date object in timestamp', () => {
      const timestamp = new Date();
      const json = {
        role: MessageRole.USER,
        content: 'Test',
        timestamp
      };
      
      const message = Message.fromJSON(json);
      
      expect(message.timestamp).toEqual(timestamp);
    });

    it('should use current date if timestamp not provided', () => {
      const json = {
        role: MessageRole.USER,
        content: 'Test'
      };
      
      const before = new Date();
      const message = Message.fromJSON(json);
      const after = new Date();
      
      expect(message.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(message.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});

