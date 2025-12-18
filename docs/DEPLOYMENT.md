# Deployment Guide

Production deployment instructions for EduAgent AI Tutor.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API keys secured (not in code)
- [ ] Tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Security headers configured
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Health checks implemented
- [ ] Error handling tested

## Deployment Options

### Option 1: Docker Compose (Recommended)

Best for: Single server deployments, VPS, dedicated servers.

#### Steps

1. **Prepare Environment:**
   ```bash
   # Create .env file
   GEMINI_API_KEY=your_production_api_key
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Build and Deploy:**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

3. **Verify:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

4. **Update:**
   ```bash
   git pull
   docker-compose up -d --build
   ```

### Option 2: Firebase (Serverless)

Best for: Scalable, serverless deployments.

#### Backend (Cloud Functions)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase:**
   ```bash
   cd backend
   firebase init functions
   ```

3. **Configure Functions:**
   - Set runtime to Node.js 18
   - Copy Express app to `functions/src/index.ts`
   - Update package.json dependencies

4. **Deploy:**
   ```bash
   firebase deploy --only functions
   ```

#### Frontend (Firebase Hosting)

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Initialize Hosting:**
   ```bash
   firebase init hosting
   ```

3. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

### Option 3: Traditional Server (PM2)

Best for: VPS, dedicated servers without Docker.

#### Backend Setup

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Build:**
   ```bash
   cd backend
   npm install
   npm run build
   ```

3. **Start with PM2:**
   ```bash
   pm2 start dist/src/index.js --name eduagent-backend
   pm2 save
   pm2 startup
   ```

#### Frontend Setup (Nginx)

1. **Build:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       root /path/to/frontend/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Restart Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 4: Kubernetes

Best for: Large-scale, container orchestration.

#### Kubernetes Manifests

Create deployment manifests:

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eduagent-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: eduagent-backend
  template:
    metadata:
      labels:
        app: eduagent-backend
    spec:
      containers:
      - name: backend
        image: eduagent-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: eduagent-secrets
              key: gemini-api-key
---
apiVersion: v1
kind: Service
metadata:
  name: eduagent-backend
spec:
  selector:
    app: eduagent-backend
  ports:
  - port: 80
    targetPort: 3000
```

## Environment Configuration

### Production Environment Variables

```bash
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=<your_production_key>
GEMINI_MODEL=gemini-2.0-flash-exp
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_DIR=./logs
MAX_MESSAGE_LENGTH=5000
MAX_CONVERSATION_HISTORY=50
```

### Security Considerations

1. **API Keys:**
   - Never commit to repository
   - Use secrets management (AWS Secrets Manager, Google Secret Manager)
   - Rotate keys regularly

2. **HTTPS:**
   - Always use HTTPS in production
   - Configure SSL certificates (Let's Encrypt)
   - Enable HSTS headers

3. **CORS:**
   - Set CORS_ORIGIN to your production domain only
   - Never use `*` in production

4. **Rate Limiting:**
   - Adjust limits based on expected traffic
   - Monitor for abuse

## Monitoring & Logging

### Application Monitoring

1. **Health Checks:**
   - `/health` endpoint
   - `/api/chat/health` endpoint
   - Configure monitoring service (UptimeRobot, Pingdom)

2. **Log Aggregation:**
   - Configure log shipping (ELK, Datadog, CloudWatch)
   - Set up log rotation
   - Monitor error rates

3. **Performance Monitoring:**
   - APM tools (New Relic, Datadog APM)
   - Response time monitoring
   - Error tracking (Sentry)

### Log Management

```bash
# View logs (Docker)
docker-compose logs -f backend

# View logs (PM2)
pm2 logs eduagent-backend

# Log files location
backend/logs/
  - error-YYYY-MM-DD.log
  - combined-YYYY-MM-DD.log
  - exceptions-YYYY-MM-DD.log
```

## Scaling

### Horizontal Scaling

1. **Load Balancer:**
   - Configure load balancer (AWS ALB, Nginx, HAProxy)
   - Health check configuration
   - Session affinity (if needed)

2. **Multiple Instances:**
   - Run multiple backend instances
   - Use process manager (PM2 cluster mode)
   - Or container orchestration (Kubernetes)

### Vertical Scaling

1. **Resource Limits:**
   - Monitor CPU and memory usage
   - Adjust container/server resources
   - Optimize code for efficiency

## Backup & Recovery

### Data Backup

Currently, the application is stateless. Future versions with database will require:
- Regular database backups
- Conversation history backup
- Configuration backup

### Disaster Recovery

1. **Infrastructure:**
   - Multi-region deployment (future)
   - Automated failover
   - Backup restoration procedures

2. **Code:**
   - Version control (Git)
   - Tagged releases
   - Rollback procedures

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          docker-compose up -d --build
```

## Rollback Procedure

### Docker Compose

```bash
# Rollback to previous version
git checkout <previous-commit>
docker-compose up -d --build
```

### PM2

```bash
# Restart previous version
pm2 restart eduagent-backend
```

## Post-Deployment Verification

1. **Health Checks:**
   ```bash
   curl https://yourdomain.com/health
   curl https://yourdomain.com/api/chat/health
   ```

2. **Functional Test:**
   ```bash
   curl -X POST https://yourdomain.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```

3. **Monitor Logs:**
   - Check for errors
   - Verify API calls
   - Monitor response times

## Support

For deployment issues:
- Check logs for errors
- Verify environment variables
- Test health endpoints
- Review [Troubleshooting](./SETUP.md#troubleshooting) section

