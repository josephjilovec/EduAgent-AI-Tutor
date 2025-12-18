/**
 * Chat Use Case
 * 
 * Application-specific business logic for handling chat interactions.
 * This layer coordinates between entities and external services.
 */

import { Message } from '../entities/Message';
import { Conversation } from '../entities/Conversation';
import { MessageRole, AgentPersona, ChatRequest, ChatResponse } from '../shared/types';
import { GeminiApiError, ValidationError } from '../shared/errors/AppError';
import { getLogger } from '../shared/logger/Logger';
import { IGeminiService } from '../adapters/interfaces/IGeminiService';

/**
 * Chat use case implementation
 * 
 * Handles the core business logic for chat interactions with multi-agent system.
 */
export class ChatUseCase {
  private readonly geminiService: IGeminiService;
  private readonly logger = getLogger();

  constructor(geminiService: IGeminiService) {
    this.geminiService = geminiService;
  }

  /**
   * Process a chat request and generate agent responses
   * 
   * @param request - Chat request with message and optional history
   * @returns Promise resolving to array of agent responses
   * @throws {ValidationError} If request is invalid
   * @throws {GeminiApiError} If Gemini API call fails
   */
  async execute(request: ChatRequest): Promise<ChatResponse[]> {
    try {
      // Validate request
      this.validateRequest(request);

      // Create or restore conversation
      const conversation = this.createConversation(request);

      // Add user message
      const userMessage = new Message(
        MessageRole.USER,
        request.message
      );
      conversation.addMessage(userMessage);

      // Generate responses from both agents
      const responses = await this.generateAgentResponses(conversation);

      return responses;
    } catch (error) {
      this.logger.error('Error in ChatUseCase.execute', { error, request });
      
      if (error instanceof ValidationError || error instanceof GeminiApiError) {
        throw error;
      }

      // Wrap unexpected errors
      throw new GeminiApiError(
        'Failed to process chat request',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Validate chat request
   * 
   * @param request - Request to validate
   * @throws {ValidationError} If validation fails
   */
  private validateRequest(request: ChatRequest): void {
    if (!request || typeof request !== 'object') {
      throw new ValidationError('Invalid request: request must be an object');
    }

    if (!request.message || typeof request.message !== 'string') {
      throw new ValidationError('Invalid request: message is required and must be a string');
    }

    const trimmedMessage = request.message.trim();
    if (trimmedMessage.length === 0) {
      throw new ValidationError('Invalid request: message cannot be empty');
    }

    if (trimmedMessage.length > 5000) {
      throw new ValidationError('Invalid request: message exceeds maximum length of 5000 characters');
    }
  }

  /**
   * Create conversation from request
   * 
   * @param request - Chat request
   * @returns Conversation entity
   */
  private createConversation(request: ChatRequest): Conversation {
    const messages = request.conversationHistory
      ? request.conversationHistory.map(msg => Message.fromJSON({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          agentPersona: msg.agentPersona
        }))
      : [];

    return new Conversation(
      messages,
      request.subject,
      request.topic
    );
  }

  /**
   * Generate responses from both AI agents
   * 
   * @param conversation - Current conversation state
   * @returns Promise resolving to array of agent responses
   */
  private async generateAgentResponses(
    conversation: Conversation
  ): Promise<ChatResponse[]> {
    const responses: ChatResponse[] = [];

    // Generate response from Explainer agent
    try {
      const explainerResponse = await this.generateAgentResponse(
        conversation,
        AgentPersona.EXPLAINER,
        'You are an expert teacher who explains concepts clearly and concisely. Focus on breaking down complex ideas into understandable parts.'
      );
      responses.push(explainerResponse);
    } catch (error) {
      this.logger.error('Failed to generate Explainer response', { error });
      // Continue with other agent even if one fails
    }

    // Generate response from Example Provider agent
    try {
      const exampleResponse = await this.generateAgentResponse(
        conversation,
        AgentPersona.EXAMPLE_PROVIDER,
        'You are a practical teacher who provides real-world examples and applications. Focus on giving concrete examples that illustrate the concepts being discussed.'
      );
      responses.push(exampleResponse);
    } catch (error) {
      this.logger.error('Failed to generate Example Provider response', { error });
    }

    if (responses.length === 0) {
      throw new GeminiApiError('Failed to generate responses from all agents');
    }

    return responses;
  }

  /**
   * Generate response from a specific agent
   * 
   * @param conversation - Current conversation
   * @param persona - Agent persona
   * @param systemPrompt - System prompt for the agent
   * @returns Promise resolving to agent response
   */
  private async generateAgentResponse(
    conversation: Conversation,
    persona: AgentPersona,
    systemPrompt: string
  ): Promise<ChatResponse> {
    try {
      // Prepare conversation history for Gemini
      const history = conversation.getGeminiFormat();

      // Add system instruction
      const prompt = `${systemPrompt}\n\nUser's question: ${conversation.messages[conversation.messages.length - 1].content}`;

      // Call Gemini API
      const responseText = await this.geminiService.generateResponse(
        prompt,
        history.slice(0, -1) // Exclude the last user message as it's in the prompt
      );

      return {
        message: responseText,
        agentPersona: persona,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error(`Failed to generate response for ${persona}`, { error });
      throw new GeminiApiError(
        `Failed to generate response from ${persona} agent`,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}

