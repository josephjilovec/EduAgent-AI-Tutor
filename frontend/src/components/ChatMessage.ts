/**
 * Chat Message Component
 * 
 * Displays individual chat messages with proper styling
 * based on role and agent persona.
 */

import { ChatMessage as ChatMessageType, AgentPersona } from '../types';

export class ChatMessageComponent {
  private message: ChatMessageType;
  private container: HTMLElement;

  constructor(message: ChatMessageType, container: HTMLElement) {
    this.message = message;
    this.container = container;
  }

  /**
   * Render the chat message
   */
  render(): HTMLElement {
    const messageDiv = document.createElement('div');
    messageDiv.className = this.getMessageClasses();

    const isUser = this.message.role === 'user';
    const agentLabel = this.getAgentLabel();

    messageDiv.innerHTML = `
      <div class="flex items-start gap-3">
        ${!isUser ? this.getAvatar() : ''}
        <div class="flex-1">
          ${!isUser && agentLabel ? `<div class="text-xs font-semibold text-gray-600 mb-1">${agentLabel}</div>` : ''}
          <div class="message-content ${isUser ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-3 shadow-sm">
            ${this.escapeHtml(this.message.content)}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            ${this.formatTimestamp(this.message.timestamp)}
          </div>
        </div>
        ${isUser ? this.getAvatar() : ''}
      </div>
    `;

    return messageDiv;
  }

  /**
   * Get CSS classes for message container
   */
  private getMessageClasses(): string {
    const baseClasses = 'mb-4 animate-fade-in';
    return this.message.role === 'user'
      ? `${baseClasses} flex justify-end`
      : `${baseClasses} flex justify-start`;
  }

  /**
   * Get agent label text
   */
  private getAgentLabel(): string {
    if (!this.message.agentPersona) return '';

    switch (this.message.agentPersona) {
      case AgentPersona.EXPLAINER:
        return '📚 Explainer';
      case AgentPersona.EXAMPLE_PROVIDER:
        return '💡 Example Provider';
      default:
        return '';
    }
  }

  /**
   * Get avatar HTML
   */
  private getAvatar(): string {
    if (this.message.role === 'user') {
      return '<div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">You</div>';
    } else {
      const emoji = this.message.agentPersona === AgentPersona.EXPLAINER ? '📚' : '💡';
      return `<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg">${emoji}</div>`;
    }
  }

  /**
   * Format timestamp for display
   */
  private formatTimestamp(timestamp: Date): string {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

