Contributing to EduAgent AI Tutor
We welcome contributions to the EduAgent AI Tutor project! Whether it's a bug report, a new feature, or an improvement to the documentation, your help is greatly appreciated. Please take a moment to review this document to understand how to contribute effectively.

Table of Contents
Code of Conduct

How Can I Contribute?

Reporting Bugs

Suggesting Enhancements

Contributing Code

Setting Up Your Development Environment

Prerequisites

Cloning the Repository

Frontend Setup

Backend Setup

Running the Application Locally

Proposing Changes and Submitting Pull Requests

Branching Strategy

Commit Messages

Creating a Pull Request

Coding Style Guidelines

License

Code of Conduct
Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms.

How Can I Contribute?
Reporting Bugs
If you find a bug, please open an issue on our GitHub Issues page. When reporting a bug, please include:

A clear and concise description of the bug.

Steps to reproduce the behavior.

Expected behavior.

Screenshots or error messages, if applicable.

Your operating system, browser, and Node.js version.

Suggesting Enhancements
We love new ideas! If you have a suggestion for an enhancement or a new feature, please open an issue on our GitHub Issues page with the label enhancement. Describe your idea clearly and explain why you think it would be a valuable addition to the project.

Contributing Code
If you'd like to contribute code, please follow the steps outlined in the Setting Up Your Development Environment and Proposing Changes and Submitting Pull Requests sections.

Setting Up Your Development Environment
To get started with development, follow these steps:

Prerequisites
Node.js and npm: Download and install from nodejs.org. (Node.js v18+ recommended)

Git: Download and install from git-scm.com.

Google Cloud Project: You will need a Google Cloud Project with the Gemini API enabled.

Google Gemini API Key: Obtain an API key from the Google AI Studio or Google Cloud Console.

Cloning the Repository
First, clone the repository to your local machine:

git clone https://github.com/your-username/eduagent-ai-tutor.git
cd eduagent-ai-tutor

(Note: Replace your-username with your actual GitHub username and ensure the repository name is correct.)

Frontend Setup
The frontend is a single HTML file with CDN links for Tailwind CSS and plain JavaScript. No direct npm install is required for the frontend.

Backend Setup
Navigate to the backend directory:

cd backend

Install backend dependencies:

npm install

This will install Express.js and any other dependencies listed in package.json.

Create a .env file:
In the backend directory, create a file named .env and add your Google Gemini API key:

GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY

Replace YOUR_GOOGLE_GEMINI_API_KEY with your actual API key. Do not commit this file to your public repository.

Running the Application Locally
Start the backend server:
From the backend directory:

npm start

The backend server will typically start on http://localhost:3000.

Open the Frontend:
Navigate to the frontend directory and open the index.html file directly in your web browser. Ensure your frontend JavaScript is configured to make fetch requests to http://localhost:3000/api/chat (or whatever port your backend is running on).

Proposing Changes and Submitting Pull Requests
Branching Strategy
We use a feature-branch workflow. Please create a new branch for each feature or bug fix you are working on.

# Create a new branch
git checkout -b feature/your-feature-name # for new features
# or
git checkout -b bugfix/your-bug-fix-name # for bug fixes

Commit Messages
Please write clear and concise commit messages. A good commit message explains what was changed and why.

Use the present tense ("Add feature" instead of "Added feature").

Use the imperative mood ("Fix bug" instead of "Fixes bug").

Limit the first line to 72 characters or less.

Reference relevant issue numbers if applicable (e.g., Fix #123).

Creating a Pull Request
Fork the repository on GitHub.

Clone your forked repository to your local machine.

Create a new branch for your changes (see Branching Strategy).

Make your changes and commit them with descriptive commit messages.

Push your branch to your forked repository on GitHub.

git push origin feature/your-feature-name

Open a Pull Request from your forked repository to the main branch of the original eduagent-ai-tutor repository.

Provide a clear title and description for your pull request.

Explain the changes you've made and why they are necessary.

Reference any related issues.

Ensure your code passes any existing tests (if applicable) and adheres to the Coding Style Guidelines.

Coding Style Guidelines
JavaScript: Follow modern ES6+ best practices. Use const and let instead of var.

HTML: Use semantic HTML5 elements.

CSS (Tailwind CSS): Prefer Tailwind utility classes. If custom CSS is needed, keep it minimal and well-commented.

Comments: Add comments to explain complex logic or non-obvious parts of the code.

License
By contributing to EduAgent AI Tutor, you agree that your contributions will be licensed under the MIT License.
