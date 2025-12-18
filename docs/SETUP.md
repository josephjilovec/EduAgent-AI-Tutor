# Setup Guide

Complete setup instructions for EduAgent AI Tutor on different platforms.

## Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **Git** (for cloning)
- **Google Gemini API Key** (from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/eduagent-ai-tutor.git
cd eduagent-ai-tutor
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Platform-Specific Instructions

### Windows

#### Using PowerShell

1. **Install Node.js:**
   - Download from [nodejs.org](https://nodejs.org/)
   - Run installer and follow prompts

2. **Verify Installation:**
   ```powershell
   node --version
   npm --version
   ```

3. **Clone and Setup:**
   ```powershell
   git clone https://github.com/your-username/eduagent-ai-tutor.git
   cd eduagent-ai-tutor
   ```

4. **Backend:**
   ```powershell
   cd backend
   npm install
   # Create .env file manually or copy .env.example
   Copy-Item .env.example .env
   # Edit .env with your API key
   npm run dev
   ```

5. **Frontend (New Terminal):**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

### macOS

#### Using Homebrew

1. **Install Node.js:**
   ```bash
   brew install node
   ```

2. **Clone and Setup:**
   ```bash
   git clone https://github.com/your-username/eduagent-ai-tutor.git
   cd eduagent-ai-tutor
   ```

3. **Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API key
   npm run dev
   ```

4. **Frontend (New Terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Linux (Ubuntu/Debian)

1. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Setup:**
   ```bash
   git clone https://github.com/your-username/eduagent-ai-tutor.git
   cd eduagent-ai-tutor
   ```

3. **Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API key
   nano .env  # or use your preferred editor
   npm run dev
   ```

4. **Frontend (New Terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Docker Setup

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start with Docker

1. **Create `.env` file in root:**
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Build and Run:**
   ```bash
   docker-compose up --build
   ```

3. **Access Application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

### Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up --build
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production) | `development` | No |
| `PORT` | Server port | `3000` | No |
| `GEMINI_API_KEY` | Google Gemini API key | - | **Yes** |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.0-flash-exp` | No |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | No |
| `LOG_LEVEL` | Logging level | `info` | No |
| `LOG_DIR` | Log directory | `./logs` | No |
| `MAX_MESSAGE_LENGTH` | Max message length | `5000` | No |
| `MAX_CONVERSATION_HISTORY` | Max conversation history | `50` | No |

### Frontend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` | No |

## Troubleshooting

### Backend Issues

**Port Already in Use:**
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000
# macOS/Linux:
lsof -i :3000

# Kill process or change PORT in .env
```

**Module Not Found:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors:**
```bash
cd backend
npm run type-check
```

### Frontend Issues

**Port Already in Use:**
- Vite will automatically try the next available port
- Or change port in `vite.config.ts`

**API Connection Errors:**
- Verify backend is running on port 3000
- Check CORS_ORIGIN in backend .env matches frontend URL
- Verify VITE_API_URL in frontend .env

### Gemini API Issues

**Invalid API Key:**
- Verify key is correct in `.env`
- Check key has Gemini API access enabled
- Ensure no extra spaces in .env file

**Rate Limiting:**
- Check Google Cloud Console for quota limits
- Implement exponential backoff in your client

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Getting Help

- **Issues:** [GitHub Issues](https://github.com/your-username/eduagent-ai-tutor/issues)
- **Documentation:** [docs/](./)
- **Code of Conduct:** [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)

