/**
 * Gemini Service Interface
 * 
 * Interface defining the contract for Gemini API integration.
 * This follows the Dependency Inversion Principle - high-level modules
 * depend on abstractions, not concrete implementations.
 */

/**
 * Interface for Gemini API service
 * 
 * Defines methods for interacting with Google Gemini API
 */
export interface IGeminiService {
  /**
   * Generate a response from Gemini API
   * 
   * @param prompt - The prompt/question to send
   * @param history - Optional conversation history
   * @returns Promise resolving to the generated response text
   * @throws {Error} If API call fails
   */
  generateResponse(
    prompt: string,
    history?: Array<{ role: string; parts: Array<{ text: string }> }>
  ): Promise<string>;
}

