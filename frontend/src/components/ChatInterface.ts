/**
 * Chat Interface Component
 * 
 * Main chat interface component that manages the conversation
 * and handles user interactions.
 */

import { ChatMessage, ChatRequest, AgentPersona } from '../types';
import { chatApi } from '../services/api';
import { ChatMessageComponent } from './ChatMessage';

export class ChatInterface {
  private container: HTMLElement;
  private messagesContainer: HTMLElement;
  private inputForm: HTMLFormElement;
  private messageInput: HTMLTextAreaElement;
  private sendButton: HTMLButtonElement;
  private loadingIndicator: HTMLElement;
  private conversationHistory: ChatMessage[] = [];
  private isProcessing: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.initializeUI();
    this.attachEventListeners();
  }

  /**
   * Initialize the UI structure
   */
  private initializeUI(): void {
    this.container.innerHTML = `
      <div class="flex flex-col h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold text-gray-900">EduAgent AI Tutor</h1>
            <p class="text-sm text-gray-600 mt-1">Learn with collaborative AI agents</p>
          </div>
        </header>

        <!-- Messages Container -->
        <div class="flex-1 overflow-y-auto px-4 py-6">
          <div class="max-w-4xl mx-auto" id="messages-container">
            <div class="text-center text-gray-500 py-8">
              <p class="text-lg mb-2">👋 Welcome to EduAgent AI Tutor!</p>
              <p class="text-sm">Ask a question to get started. Our AI agents will help you learn.</p>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="bg-white border-t border-gray-200 px-4 py-4">
          <div class="max-w-4xl mx-auto">
            <form id="chat-form" class="flex gap-3">
              <textarea
                id="message-input"
                rows="1"
                placeholder="Ask a question..."
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                maxlength="5000"
              ></textarea>
              <button
                type="submit"
                id="send-button"
                class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </form>
            <div id="loading-indicator" class="hidden mt-2 text-sm text-gray-500">
              <span class="animate-pulse">AI agents are thinking...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.messagesContainer = document.getElementById('messages-container')!;
    this.inputForm = document.getElementById('chat-form') as HTMLFormElement;
    this.messageInput = document.getElementById('message-input') as HTMLTextAreaElement;
    this.sendButton = document.getElementById('send-button') as HTMLButtonElement;
    this.loadingIndicator = document.getElementById('loading-indicator')!;
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    // Form submission
    this.inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSendMessage();
    });

    // Auto-resize textarea
    this.messageInput.addEventListener('input', () => {
      this.messageInput.style.height = 'auto';
      this.messageInput.style.height = `${this.messageInput.scrollHeight}px`;
    });

    // Enter key handling (Shift+Enter for new line, Enter to send)
    this.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });
  }

  /**
   * Handle sending a message
   */
  private async handleSendMessage(): Promise<void> {
    const messageText = this.messageInput.value.trim();

    if (!messageText || this.isProcessing) {
      return;
    }

    // Add user message to UI
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    this.addMessage(userMessage);

    // Clear input
    this.messageInput.value = '';
    this.messageInput.style.height = 'auto';

    // Set processing state
    this.setProcessing(true);

    try {
      // Prepare request
      const request: ChatRequest = {
        message: messageText,
        conversationHistory: this.conversationHistory
      };

      // Send to API
      const response = await chatApi.sendMessage(request);

      // Add agent responses to UI
      for (const agentResponse of response.responses) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: agentResponse.message,
          timestamp: new Date(agentResponse.timestamp),
          agentPersona: agentResponse.agentPersona
        };
        this.addMessage(assistantMessage);
      }
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      this.setProcessing(false);
    }
  }

  /**
   * Add a message to the conversation
   */
  private addMessage(message: ChatMessage): void {
    // Add to history
    this.conversationHistory.push(message);

    // Remove welcome message if present
    const welcomeMessage = this.messagesContainer.querySelector('.text-center');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    // Render message
    const messageComponent = new ChatMessageComponent(message, this.messagesContainer);
    const messageElement = messageComponent.render();
    this.messagesContainer.appendChild(messageElement);

    // Scroll to bottom
    this.scrollToBottom();

    // Limit conversation history (keep last 50 messages)
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800';
    errorDiv.textContent = `Error: ${message}`;
    this.messagesContainer.appendChild(errorDiv);
    this.scrollToBottom();

    // Remove error after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  /**
   * Set processing state
   */
  private setProcessing(processing: boolean): void {
    this.isProcessing = processing;
    this.sendButton.disabled = processing;
    this.messageInput.disabled = processing;

    if (processing) {
      this.loadingIndicator.classList.remove('hidden');
    } else {
      this.loadingIndicator.classList.add('hidden');
    }
  }

  /**
   * Scroll to bottom of messages
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }
}

