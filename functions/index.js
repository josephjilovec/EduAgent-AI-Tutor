// functions/index.js
// This file acts as a wrapper to expose your server.js Express application
// as an HTTP Firebase Cloud Function.

// Import the Firebase Functions library
const functions = require('firebase-functions');

// Import your Express application from server.js
// We assume that server.js exports the Express app instance.
// Note: When deploying to Firebase Functions, the 'backend' directory
// will be the 'source' directory, so paths are relative to 'backend'.
const app = require('../backend/server'); // Adjust path if your server.js is not directly in 'backend'

// Expose the Express app as an HTTP Cloud Function
// The function name 'eduAgentApi' matches the rewrite rule in firebase.json
// This tells Firebase to route requests to /api/** to this function.
exports.eduAgentApi = functions.https.onRequest(app);

// You might also want to add a simple log to confirm the function is loaded
console.log('Firebase Cloud Function "eduAgentApi" loaded.');
