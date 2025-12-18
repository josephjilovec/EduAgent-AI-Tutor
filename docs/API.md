# API Documentation

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://api.eduagent.com` (example)

## Authentication

Currently, the API does not require authentication. Future versions will implement JWT-based authentication.

## Rate Limiting

- **Window:** 15 minutes (900,000ms)
- **Max Requests:** 100 per IP address
- **Response Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Endpoints

### Health Check

Check API health status.

**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### Chat Endpoint

Send a message and receive responses from AI agents.

**POST** `/api/chat`

**Request Body:**
```json
{
  "message": "What is photosynthesis?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help you learn today?",
      "timestamp": "2024-01-01T00:00:01.000Z",
      "agentPersona": "explainer"
    }
  ],
  "subject": "Biology",
  "topic": "Photosynthesis"
}
```

**Request Fields:**
- `message` (string, required): The user's question or message (1-5000 characters)
- `conversationHistory` (array, optional): Previous messages in the conversation
- `subject` (string, optional): Subject being taught (max 200 characters)
- `topic` (string, optional): Specific topic (max 200 characters)

**Response:**
```json
{
  "success": true,
  "responses": [
    {
      "message": "Photosynthesis is the process by which plants...",
      "agentPersona": "explainer",
      "timestamp": "2024-01-01T00:00:02.000Z"
    },
    {
      "message": "For example, when you see a green leaf...",
      "agentPersona": "example_provider",
      "timestamp": "2024-01-01T00:00:03.000Z"
    }
  ]
}
```

**Response Fields:**
- `success` (boolean): Indicates if the request was successful
- `responses` (array): Array of agent responses
  - `message` (string): The agent's response text
  - `agentPersona` (string): Either "explainer" or "example_provider"
  - `timestamp` (string): ISO 8601 timestamp

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - Gemini API error

**Error Response:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Message is required and must be a string",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Chat Health Check

Check chat service health.

**GET** `/api/chat/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "chat",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `GEMINI_API_ERROR` | Gemini API call failed | 502 |
| `INTERNAL_ERROR` | Internal server error | 500 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `NOT_FOUND` | Resource not found | 404 |

## Message Roles

- `user` - User message
- `assistant` - AI agent response
- `system` - System message (future use)

## Agent Personas

- `explainer` - Explainer agent (conceptual explanations)
- `example_provider` - Example Provider agent (practical examples)

## Request/Response Examples

### Simple Request
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is gravity?"
  }'
```

### With Conversation History
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you give me an example?",
    "conversationHistory": [
      {
        "role": "user",
        "content": "What is gravity?",
        "timestamp": "2024-01-01T00:00:00.000Z"
      },
      {
        "role": "assistant",
        "content": "Gravity is a force that attracts objects...",
        "timestamp": "2024-01-01T00:00:01.000Z",
        "agentPersona": "explainer"
      }
    ]
  }'
```

## Best Practices

1. **Include Conversation History**: For better context, include previous messages
2. **Handle Errors Gracefully**: Check response status and error codes
3. **Respect Rate Limits**: Implement exponential backoff on 429 errors
4. **Validate Input**: Ensure message length and format before sending
5. **Use HTTPS**: Always use HTTPS in production

## WebSocket Support (Future)

Future versions may include WebSocket support for real-time streaming responses.

