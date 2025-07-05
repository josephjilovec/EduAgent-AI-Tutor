// server.js
// This file sets up the Node.js Express server for the EduAgent AI Tutor backend.
// It defines the API endpoint that the frontend will call to interact with the AI agents.

// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors for cross-origin requests

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000; // Use port from environment variable or default to 3000

// --- Middleware Setup ---

// Enable CORS for all origins. In a production environment, you might want to restrict this
// to only your frontend's domain for security.
app.use(cors());

// Parse JSON bodies for incoming requests (e.g., from frontend)
app.use(express.json());

// Serve static files from the 'public' directory (your frontend files)
// This is crucial for the frontend (index.html, style.css, script.js) to be served by the backend.
app.use(express.static('public'));

// --- AI Service and Agent Logic (PLACEHOLDERS) ---
// In a real application, you would import these modules:
// const { callGeminiAPI } = require('./geminiService');
// const { orchestrateAgents } = require('./agentLogic');

// Placeholder for Gemini API service.
// In geminiService.js, this function would make the actual call to the Google Gemini API.
async function callGeminiAPI(prompt) {
    // --- IMPORTANT: This is a placeholder. Implement actual Gemini API call in geminiService.js ---
    console.log(`[Gemini Service Placeholder] Calling Gemini with prompt: "${prompt.substring(0, 100)}..."`);
    // Simulate a delay and return a mock response
    return new Promise(resolve => {
        setTimeout(() => {
            // This mock response simulates what Gemini might return based on a prompt
            // designed to get both an explanation and an example.
            const mockResponse = {
                text: `Explanation: This is a mock explanation for your query. 
                       Example: This is a mock example related to your query.`
            };
            resolve(mockResponse);
        }, 1000); // Simulate API call latency
    });
}

// Placeholder for agent orchestration logic.
// In agentLogic.js, this function would parse Gemini's response and assign parts to agents.
async function orchestrateAgents(userQuery) {
    // --- IMPORTANT: This is a placeholder. Implement actual agent logic in agentLogic.js ---
    console.log(`[Agent Logic Placeholder] Orchestrating agents for query: "${userQuery}"`);

    // Build a prompt that encourages Gemini to provide both an explanation and an example.
    const combinedPrompt = `The user wants to learn about "${userQuery}".
    Please provide a concise explanation of the concept, followed by a clear, simple, real-world example.
    Format your response like this:
    Explanation: [Your explanation here]
    Example: [Your example here]`;

    try {
        const geminiResponse = await callGeminiAPI(combinedPrompt);
        const fullText = geminiResponse.text;

        // Simple parsing of the mock response (you'll need more robust parsing for real Gemini output)
        let explainerResponse = "I'm having trouble explaining that right now.";
        let exampleResponse = "I don't have an example for that at the moment.";

        const explanationMatch = fullText.match(/Explanation: (.*?)Example:/s);
        if (explanationMatch && explanationMatch[1]) {
            explainerResponse = explanationMatch[1].trim();
        }

        const exampleMatch = fullText.match(/Example: (.*)/s);
        if (exampleMatch && exampleMatch[1]) {
            exampleResponse = exampleMatch[1].trim();
        }

        return { explainerResponse, exampleResponse };

    } catch (error) {
        console.error('Error in orchestrateAgents:', error);
        throw new Error('Failed to get AI responses.');
    }
}


// --- API Endpoint Definition ---

// POST /api/chat endpoint
// This endpoint receives the user's message from the frontend and sends back AI responses.
app.post('/api/chat', async (req, res) => {
    const userQuery = req.body.query; // Extract the user's query from the request body

    if (!userQuery) {
        return res.status(400).json({ error: 'Missing user query' });
    }

    console.log(`Received query from frontend: "${userQuery}"`);

    try {
        // Orchestrate the AI agents to get their responses
        const { explainerResponse, exampleResponse } = await orchestrateAgents(userQuery);

        // Send the AI responses back to the frontend
        res.json({
            explainerResponse,
            exampleResponse
        });
    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({ error: 'Failed to get response from AI agents.' });
    }
});

// --- Server Start ---

// Start the Express server and listen for incoming requests
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Frontend accessible at http://localhost:${port}/index.html`);
});
