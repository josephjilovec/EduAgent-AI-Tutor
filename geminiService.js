// geminiService.js
// This module handles all interactions with the Google Gemini API.
// It is responsible for constructing prompts, making API calls, and
// maintaining conversational history for context.

// Load environment variables (specifically GEMINI_API_KEY)
require('dotenv').config();

// Ensure the API key is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set in the environment variables.');
    // In a production app, you might want to throw an error or handle this more gracefully.
    // For now, we'll proceed but API calls will fail.
}

// Base URL for the Gemini API
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Makes a call to the Google Gemini API to generate content.
 * It constructs the payload, sends the request, and processes the response.
 *
 * @param {Array<Object>} chatHistory - An array of message objects representing the conversation history.
 * Each object should have a 'role' (e.g., "user", "model") and 'parts' (e.g., [{ text: "message" }]).
 * Example: [{ role: "user", parts: [{ text: "Hello" }] }, { role: "model", parts: [{ text: "Hi there!" }] }]
 * @param {string} prompt - The specific prompt for the current turn.
 * @returns {Promise<string>} The generated text response from the Gemini model.
 * @throws {Error} If the API call fails or returns an unexpected response.
 */
async function callGeminiAPI(chatHistory, prompt) {
    // Add the current user prompt to the chat history for this specific API call.
    // Note: The `chatHistory` passed here should already contain previous turns.
    // For the Gemini API, the `contents` array should include the full conversation.
    const currentChatContents = [
        ...chatHistory,
        { role: "user", parts: [{ text: prompt }] }
    ];

    const payload = {
        contents: currentChatContents,
        // Optional: Configure generation parameters if needed (e.g., temperature, max output tokens)
        // generationConfig: {
        //     temperature: 0.7,
        //     maxOutputTokens: 200,
        // },
    };

    try {
        console.log(`[GeminiService] Sending request to Gemini API...`);
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Check if the response was successful
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[GeminiService] API Error: ${response.status} - ${errorBody}`);
            throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody}`);
        }

        const result = await response.json();

        // Validate the structure of the Gemini API response
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const generatedText = result.candidates[0].content.parts[0].text;
            console.log(`[GeminiService] Received response from Gemini.`);
            return generatedText;
        } else {
            console.warn('[GeminiService] Unexpected API response structure:', JSON.stringify(result, null, 2));
            throw new Error('Unexpected response structure from Gemini API. No text content found.');
        }

    } catch (error) {
        console.error('[GeminiService] Error calling Gemini API:', error);
        throw new Error(`Failed to communicate with Gemini API: ${error.message}`);
    }
}

module.exports = {
    callGeminiAPI,
};
