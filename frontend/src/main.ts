/**
 * Application Entry Point
 * 
 * Initializes the frontend application and sets up the chat interface.
 */

import './style.css';
import { ChatInterface } from './components/ChatInterface';

/**
 * Initialize the application when DOM is ready
 */
function initializeApp(): void {
  const root = document.getElementById('root');
  
  if (!root) {
    console.error('Root element not found');
    return;
  }

  // Initialize chat interface
  new ChatInterface(root);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

