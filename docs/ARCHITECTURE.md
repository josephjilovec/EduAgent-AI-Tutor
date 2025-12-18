# Architecture Documentation

## System Design Overview

EduAgent AI Tutor follows **Clean Architecture** principles, ensuring separation of concerns, testability, and maintainability. The system is organized into distinct layers with clear dependency rules.

## Architecture Layers

### 1. Entities (Core Business Logic)
**Location:** `backend/src/entities/`

The innermost layer containing pure business logic and domain models:
- `Message.ts` - Represents a chat message with validation
- `Conversation.ts` - Manages conversation state and history

**Characteristics:**
- No dependencies on external frameworks
- Pure TypeScript classes with business rules
- Self-contained validation logic

### 2. Use Cases (Application Logic)
**Location:** `backend/src/usecases/`

Application-specific business logic that orchestrates entities:
- `ChatUseCase.ts` - Handles chat interactions and coordinates multi-agent responses

**Characteristics:**
- Depends only on entities and interfaces
- Contains application-specific rules
- Coordinates between entities and external services

### 3. Interface Adapters
**Location:** `backend/src/adapters/`

Defines interfaces for external services:
- `interfaces/IGeminiService.ts` - Contract for Gemini API integration

**Characteristics:**
- Defines contracts (interfaces)
- No concrete implementations
- Enables dependency inversion

### 4. Frameworks & Drivers (External)
**Location:** `backend/src/frameworks/`

Concrete implementations of external services and frameworks:
- `express/` - Express.js application setup, routes, middleware
- `gemini/GeminiService.ts` - Google Gemini API implementation

**Characteristics:**
- Implements interfaces from adapters layer
- Handles external API calls
- Framework-specific code (Express, Gemini SDK)

## Dependency Flow

```
Frameworks → Interface Adapters → Use Cases → Entities
     ↓              ↓                ↓          ↓
  (Outer)                      (Inner)
```

**Rule:** Dependencies always point inward. Inner layers never depend on outer layers.

## Data Flow

### Chat Request Flow

1. **HTTP Request** → Express Router (`frameworks/express/routes/chatRoutes.ts`)
2. **Validation** → Express Middleware (`frameworks/express/middleware/validation.ts`)
3. **Use Case** → `ChatUseCase.execute()`
4. **Entity Creation** → `Message` and `Conversation` entities
5. **Service Call** → `GeminiService.generateResponse()`
6. **API Response** → Back to client

## Shared Layer

**Location:** `backend/src/shared/`

Common utilities and types used across layers:
- `types/` - TypeScript type definitions
- `errors/` - Custom error classes
- `logger/` - Winston logger configuration
- `config/` - Environment configuration management

## Security Architecture

### Backend Security
- **Helmet.js** - Security headers (XSS, CSRF protection)
- **CORS** - Configurable origin restrictions
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Express-validator with Zod schemas
- **Error Handling** - No sensitive data leakage

### Frontend Security
- **XSS Prevention** - HTML escaping in message rendering
- **CSP Headers** - Content Security Policy via Nginx
- **HTTPS Ready** - Production deployment configuration

## Multi-Agent System

The system employs two AI agents with distinct personas:

1. **Explainer Agent** (`AgentPersona.EXPLAINER`)
   - Focus: Clear, concise explanations
   - Breaks down complex concepts

2. **Example Provider Agent** (`AgentPersona.EXAMPLE_PROVIDER`)
   - Focus: Real-world examples and applications
   - Provides concrete illustrations

Both agents use the same Gemini API but with different system prompts to achieve distinct teaching styles.

## Error Handling Strategy

### Error Hierarchy
```
AppError (base)
├── ValidationError (400)
├── RateLimitError (429)
├── GeminiApiError (502)
├── UnauthorizedError (401)
├── NotFoundError (404)
└── InternalError (500)
```

### Error Flow
1. Error occurs in any layer
2. Caught and wrapped in appropriate `AppError` subclass
3. Logged with context (Winston)
4. Transformed to user-friendly response
5. Sent to client with appropriate HTTP status

## Logging & Observability

### Log Levels
- **ERROR** - System errors, exceptions
- **WARN** - Operational issues, retries
- **INFO** - Important events, API calls
- **DEBUG** - Detailed debugging (development only)

### Log Rotation
- Daily log file rotation
- 14-day retention
- 20MB max file size
- Separate files for errors, combined logs, exceptions

## Performance Considerations

### Backend
- **Compression** - Gzip middleware for responses
- **Connection Pooling** - HTTP keep-alive
- **Retry Logic** - Exponential backoff for API calls
- **Rate Limiting** - Prevents resource exhaustion

### Frontend
- **Code Splitting** - Vite automatic code splitting
- **Asset Optimization** - Minification and compression
- **Caching** - Static asset caching via Nginx
- **Lazy Loading** - On-demand resource loading

## Scalability

### Horizontal Scaling
- Stateless backend design
- Docker containerization
- Load balancer ready
- Database-ready architecture (can add persistence layer)

### Vertical Scaling
- Efficient memory usage
- Connection pooling
- Async/await patterns
- Non-blocking I/O

## Testing Strategy

### Unit Tests
- Entity validation
- Use case logic
- Service implementations

### Integration Tests
- API endpoints
- Error handling
- End-to-end flows

### Test Coverage
- Target: >80% code coverage
- Critical paths: 100% coverage

## Deployment Architecture

### Development
- Local Node.js servers
- Hot reload (ts-node-dev)
- Development logging

### Production
- Docker containers
- Nginx reverse proxy
- Health checks
- Graceful shutdown
- Log aggregation ready

## Future Enhancements

### Planned Additions
1. **Database Layer** - Conversation persistence
2. **Authentication** - User management
3. **Caching** - Redis for API responses
4. **Monitoring** - APM integration
5. **CI/CD** - Automated testing and deployment

