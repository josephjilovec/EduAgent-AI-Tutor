// agentLogic.js
// This module defines the distinct personas and roles of the AI agents
// and contains the logic for orchestrating their collaborative interaction.

// Import the Gemini API service
const { callGeminiAPI } = require('./geminiService');

/**
 * Orchestrates the interaction between the Explainer Agent and the Example Provider Agent.
 * It crafts a single prompt for the Gemini API, instructing it to generate responses
 * from both agent perspectives, then parses the combined response.
 *
 * @param {string} userQuery - The user's current question or topic.
 * @param {Array<Object>} chatHistory - The ongoing conversation history, including previous user and model turns.
 * This is passed to the Gemini API to maintain context.
 * @returns {Promise<{explainerResponse: string, exampleResponse: string}>} - An object containing
 * the generated responses for the Explainer Agent and the Example Provider Agent.
 * @throws {Error} If the AI response cannot be generated or parsed correctly.
 */
async function orchestrateAgents(userQuery, chatHistory) {
    console.log(`[AgentLogic] Orchestrating agents for user query: "${userQuery}"`);

    // Define the personas and the desired output format for Gemini.
    // We instruct Gemini to act as both agents and provide structured output.
    const agentPrompt = `
    You are two collaborative AI tutors: an "Explainer Agent" and an "Example Provider Agent".
    Your goal is to teach the user about "${userQuery}".

    **Explainer Agent**: Your role is to provide a clear, concise, and easy-to-understand explanation of the concept. Focus on the core principles and definitions.
    **Example Provider Agent**: Your role is to provide a simple, relatable, real-world example that illustrates the concept explained by the Explainer Agent. The example should make the abstract concept concrete.

    Please provide your responses in the following structured format, with no additional text outside these tags:
    Explainer: [Your detailed explanation here]
    Example: [Your clear, real-world example here]
    `;

    try {
        // Call the Gemini API with the combined prompt and the full chat history for context.
        // The chatHistory ensures Gemini understands the ongoing conversation.
        const combinedGeminiResponse = await callGeminiAPI(chatHistory, agentPrompt);
        console.log(`[AgentLogic] Raw Gemini response received: ${combinedGeminiResponse.substring(0, 200)}...`);

        // Parse the combined response into separate parts for each agent.
        // We use regular expressions to extract content based on the defined format.
        const explainerMatch = combinedGeminiResponse.match(/Explainer: ([\s\S]*?)\nExample:/);
        const exampleMatch = combinedGeminiResponse.match(/Example: ([\s\S]*)/);

        let explainerResponse = "I'm sorry, I couldn't generate a clear explanation for that topic right now. Please try rephrasing your question.";
        let exampleResponse = "I'm sorry, I couldn't generate a suitable example for that topic right now.";

        if (explainerMatch && explainerMatch[1]) {
            explainerResponse = explainerMatch[1].trim();
        }

        if (exampleMatch && exampleMatch[1]) {
            exampleResponse = exampleMatch[1].trim();
        }

        // Return the parsed responses
        return { explainerResponse, exampleResponse };

    } catch (error) {
        console.error('[AgentLogic] Error orchestrating agents:', error);
        throw new Error(`Failed to get orchestrated AI responses: ${error.message}`);
    }
}

module.exports = {
    orchestrateAgents,
};
