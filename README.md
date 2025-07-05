EduAgent AI Tutor

Project Name: EduAgent AI Tutor

Description:
EduAgent AI Tutor is an interactive web application designed to provide a dynamic and engaging learning experience through collaborative AI agents. The application features two distinct AI personas that work together to teach a user a specific subject through conversational dialogue. These agents explain concepts, provide relevant examples, and answer user questions in real-time, simulating a collaborative teaching environment. This project aims to demonstrate advanced AI integration for educational purposes, making complex topics more accessible and enjoyable to learn.

Key Features:
Interactive Chat Interface: Users can ask questions and receive immediate, conversational responses from the AI agents. The real-time interaction fosters an engaging learning environment.

Collaborative AI Agents: The system employs two distinct AI personas (e.g., an "Explainer" and an "Example Provider") that collaborate to deliver comprehensive learning content. This dual-agent approach ensures both conceptual understanding and practical application.

Dynamic Content Generation: Leveraging the Google Gemini API (specifically gemini-2.0-flash), the application dynamically generates explanations, examples, and manages the conversational flow, adapting to the user's queries.

Responsive Design: The user interface is built with a clean and intuitive design, ensuring optimal viewing and usability across various screen sizes, from mobile devices to large desktops.

Technologies Used
Frontend:
HTML5: For structuring the web content.
CSS3 (Tailwind CSS): For rapid and responsive styling.
JavaScript (ES6+): For interactive elements and frontend logic.

Backend:
Node.js: JavaScript runtime environment.
Express.js: A fast, unopinionated, minimalist web framework for Node.js, used for building the API server.
AI/LLM:
Google Gemini API (gemini-2.0-flash): The core AI model for generating conversational content.

Deployment (Suggested for future):
Firebase:
Firebase Hosting: For deploying the frontend web application.
Firebase Cloud Functions: For deploying the Node.js backend as serverless functions, handling API calls to Gemini.

Setup and Installation
Follow these steps to set up and run the EduAgent AI Tutor project on your local machine.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js and npm: Download and install from nodejs.org. (Node.js v18+ recommended)
Git: Download and install from git-scm.com.
Google Cloud Project: You will need a Google Cloud Project with the Gemini API enabled.
Google Gemini API Key: Obtain an API key from the Google AI Studio or Google Cloud Console.

Frontend Setup
Clone the repository:

git clone https://github.com/josephjilovec/eduagent-ai-tutor.git
cd eduagent-ai-tutor

(Note: Replace your-username with your actual GitHub username and ensure the repository name is correct.)

Navigate to the frontend directory:

cd frontend

No direct npm install for frontend: For this project, the frontend is a single HTML file with CDN links for Tailwind CSS and plain JavaScript. There are no direct npm dependencies for the frontend itself.

Backend Setup
Navigate to the backend directory:
cd ../backend # Assuming you are in the 'frontend' directory

If you are in the root directory, use:
cd backend

Install backend dependencies:
npm install

This will install Express.js and any other dependencies listed in package.json.

Create a .env file:
In the backend directory, create a file named .env and add your Google Gemini API key:
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY

Replace YOUR_GOOGLE_GEMINI_API_KEY with your actual API key. Do not commit this file to your public repository.

Running the Application
Running the Backend Server
Start the backend server:
From the backend directory:

npm start

The backend server will typically start on http://localhost:3000 (or another port specified in your Express app).

Running the Frontend
Open the HTML file:
Navigate to the frontend directory. Open the index.html file directly in your web browser.
Alternatively, if you have a live server extension (like Live Server for VS Code), you can use that to serve the index.html file.

Connect Frontend to Backend:
Ensure that the JavaScript in your index.html file (or separate frontend JavaScript files) is configured to make fetch requests to your backend server (e.g., http://localhost:3000/api/chat).

API Key Configuration
The Google Gemini API key is configured in the backend.

Obtain your API Key:

Go to Google AI Studio or the Google Cloud Console.

Create a new API key for your project.

Set in .env file:
As mentioned in the Backend Setup, create a .env file in your backend directory with the following content:

GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY

Replace YOUR_GOOGLE_GEMINI_API_KEY with the key you obtained.

Deployment Considerations (Future)
For production deployment, Firebase is a recommended platform due to its seamless integration for both frontend hosting and serverless backend functions.

Firebase Hosting: Deploy your frontend directory to Firebase Hosting.

Firebase Cloud Functions: Deploy your backend Express.js application as a Firebase Cloud Function. This allows your backend to scale automatically and handle API requests securely.

You would typically initialize Firebase in your project, then configure firebase.json for hosting and functions.

Environment variables (like GEMINI_API_KEY) for Cloud Functions are managed via firebase functions:config:set or the Firebase console.

Future Enhancements
User Authentication: Implement user login/signup to personalize learning paths and save chat history.

Subject Selection: Allow users to choose specific subjects or topics to learn (e.g., Physics, History, Programming).

Agent Personalization: Enable users to customize agent personas or choose from a library of pre-defined teaching styles.

Interactive Elements: Integrate more interactive components beyond text, such as quizzes, drag-and-drop exercises, or embedded simulations.

Progress Tracking: Track user progress, identify areas of difficulty, and suggest relevant topics for review.

Multimedia Integration: Allow agents to share images, videos, or links to external resources.

Voice Interface: Add speech-to-text and text-to-speech capabilities for a more natural conversational experience.

Advanced Error Handling & Feedback: Provide more robust error messages and user-friendly feedback mechanisms.

Rate Limiting: Implement rate limiting on API calls to prevent abuse and manage costs.

License
This project is licensed under the MIT License - see the LICENSE file for details.
