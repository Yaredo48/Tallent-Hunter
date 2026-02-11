# Production Deployment Guide

## Overview
This guide covers deploying the Talent Architecture Engine to production using Docker.

---

## Prerequisites

- Docker and Docker Compose installed on the production server
- Domain name configured (optional, but recommended)
- SSL/TLS certificates (for HTTPS)
- Hugging Face API key (for AI features)
- At least 2GB RAM and 10GB storage

---

## Environment Setup

### 1. Create Production Environment File

Create a `.env.prod` file with production configurations:

```bash
# Database
DB_PASSWORD=your_secure_database_password_here

# JWT Secrets (generate secure random strings)
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
REFRESH_TOKEN_SECRET=your_super_secure_refresh_secret_minimum_32_characters

# Hugging Face AI
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
AI_ENABLED=true

# Logging
LOG_LEVEL=info

# Frontend API URL (change to your domain)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Generate Secure Secrets

```bash
# Generate JWT secrets
openssl rand -base64 48

# Generate another for refresh token
openssl rand -base64 48
```

---

## Deployment Steps

### Option 1: Docker Compose Production Deployment

1. **Clone the repository on production server:**
   ```bash
   git clone <your-repo-url>
   cd Tallent-Hunter
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.prod
   # Edit .env.prod with your secure values
   ```

3. **Build and start services:**
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
   ```

4. **Run database migrations:**
   ```bash
   docker exec -it talent-hunter-api pnpm prisma migrate deploy
   ```

5. **Create initial organization (for first user):**
   ```bash
   docker exec -it $(docker ps -q -f name=postgres) psql -U postgres -d talent_hunter -c "INSERT INTO \"Organization\" (id, name, slug, \"createdAt\", \"updatedAt\") VALUES ('prod-org-001', 'YourCompany', 'yourcompany', NOW(), NOW());"
   ```

6. **Verify services are running:**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

### Option 2: Individual Docker Containers

If you prefer, you can run containers individually:

```bash
# Network
docker network create talent-network

# PostgreSQL
docker run -d --name talent-postgres \
  --network talent-network \
  -e POSTGRES_DB=talent_hunter \
  -e POSTGRES_PASSWORD=your_password \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine

# Redis
docker run -d --name talent-redis \
  --network talent-network \
  -v redis_data:/data \
  redis:7-alpine

# API
docker build -f apps/api/Dockerfile -t talent-api .
docker run -d --name talent-api \
  --network talent-network \
  -p 3001:3001 \
  --env-file .env.prod \
  talent-api

# Web
docker build -f apps/web/Dockerfile -t talent-web .
docker run -d --name talent-web \
  --network talent-network \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://talent-api:3001 \
  talent-web
```

---

## SSL/HTTPS Setup (Recommended)

### Using Nginx as Reverse Proxy

1. **Install Nginx and Certbot:**
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Configure Nginx:**
   ```nginx
   # /etc/nginx/sites-available/talent-hunter
   
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable site and get SSL:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/talent-hunter /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
   ```

---

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f api

# Application logs (from Winston)
docker exec talent-hunter-api cat logs/application-$(date +%Y-%m-%d).log
docker exec talent-hunter-api cat logs/error-$(date +%Y-%m-%d).log
```

### Database Backups

```bash
# Create backup
docker exec talent-hunter-postgres pg_dump -U postgres talent_hunter > backup-$(date +%Y%m%d).sql

# Restore from backup
docker exec -i talent-hunter-postgres psql -U postgres talent_hunter < backup-20260211.sql
```

### Updates and Maintenance

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations if schema changed
docker exec talent-hunter-api pnpm prisma migrate deploy
```

---

## Health Checks

The production setup includes health checks for all services:

- **API**: `http://localhost:3001/health`
- **Web**: `http://localhost:3000`
- **PostgreSQL**: automatic health check via pg_isready
- **Redis**: automatic health check via redis-cli ping

---

## Scaling Considerations

### Horizontal Scaling

For high traffic, consider:

1. **Load Balancer**: Use Nginx or HAProxy
2. **Multiple API Instances**: Scale API containers
3. **Database Replication**: PostgreSQL read replicas
4. **Redis Clustering**: For session management

### Vertical Scaling

Adjust Docker resource limits:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs api

# Check container status
docker ps -a

# Restart specific service
docker-compose -f docker-compose.prod.yml restart api
```

### Database Connection Issues

```bash
# Test database connection
docker exec talent-hunter-api npx prisma db push --skip-generate

# Check PostgreSQL logs
docker logs talent-hunter-postgres
```

### AI Generation Not Working

1. Verify `HUGGINGFACE_API_KEY` is set
2. Check API logs for AI-related errors
3. Ensure `AI_ENABLED=true`
4. Test API key validity at https://huggingface.co

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Keep secrets secure** - never commit `.env.prod`
3. **Regular updates** - keep Docker images and dependencies updated
4. **Database access** - limit to internal network only
5. **API rate limiting** - implement rate limits on public endpoints
6. **Monitoring** - set up error monitoring (Sentry) for production

---

## Support

For issues or questions:
- Check logs first: application logs and Docker logs
- Review the [DEVELOPMENT.md](./DEVELOPMENT.md) guide
- Check the [AI_TESTING.md](./AI_TESTING.md) guide for AI-related issues
