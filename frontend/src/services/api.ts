/**
 * API Service
 * 
 * Handles all HTTP communication with the backend API.
 * Includes error handling, retry logic, and request/response transformation.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ChatRequest, ApiResponse, ApiError } from '../types';

/**
 * API client configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for AI generation
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Error handler for API requests
 * 
 * @param error - Axios error
 * @returns Formatted error message
 */
function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response) {
      // Server responded with error status
      const errorData = axiosError.response.data;
      return errorData?.message || `Server error: ${axiosError.response.status}`;
    } else if (axiosError.request) {
      // Request made but no response received
      return 'Network error: Unable to reach server. Please check your connection.';
    }
  }
  
  // Unknown error
  return error instanceof Error ? error.message : 'An unexpected error occurred';
}

/**
 * Chat API service
 */
export class ChatApiService {
  /**
   * Send a chat message and get AI agent responses
   * 
   * @param request - Chat request
   * @returns Promise resolving to API response
   * @throws {Error} If request fails
   */
  async sendMessage(request: ChatRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/chat', request);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Check API health
   * 
   * @returns Promise resolving to health status
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const chatApi = new ChatApiService();

