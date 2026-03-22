# Backend Deployment Guide

## Production Checklist

### Environment Setup
- [ ] Set `NODE_ENV=production`
- [ ] Configure valid `PORT` (typically 5000 or forwarded by reverse proxy)
- [ ] Set `DB_URL` to production MongoDB connection string
- [ ] Use environment variables, never hardcode secrets

### Pre-Deployment
```bash
npm run build          # Validate environment and lint code
npm run lint           # Check code quality
npm run validate-env   # Verify all required env vars are set
```

### Deployment Commands
```bash
# On production server
npm install --production
npm run start:prod
```

### Monitoring
- Server logs show port and environment on startup
- Health check available at `/health`
- Graceful shutdown on SIGTERM signal

### Security Recommendations
1. Use HTTPS/TLS in production
2. Deploy behind a reverse proxy (nginx, Apache)
3. Keep dependencies updated: `npm audit`
4. Set proper CORS headers if needed
5. Validate all user inputs
6. Use environment variables for secrets (never commit .env)

### Scaling Considerations
- Use process managers like PM2 or systemd
- Implement database connection pooling
- Add caching layer (Redis)
- Load balancing for multiple instances
- Implement proper logging and monitoring
