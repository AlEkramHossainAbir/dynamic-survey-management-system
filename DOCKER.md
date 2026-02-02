# Docker Setup Guide

This project includes Docker configurations for both development and production environments.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)

## Files Created

- `backend/Dockerfile` - Multi-stage Dockerfile for backend service
- `frontend/Dockerfile` - Multi-stage Dockerfile for frontend service
- `docker-compose.yml` - Development environment configuration
- `docker-compose.prod.yml` - Production environment configuration
- `.dockerignore` files - Optimize build context

## Development Environment

### Start the application

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger API Docs: http://localhost:5000/api-docs

### Stop the application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Run commands in containers

```bash
# Execute Prisma migrations
docker-compose exec backend npx prisma migrate dev

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Seed database
docker-compose exec backend npx prisma db seed

# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh
```

## Production Environment

### Start production services

```bash
# Build and start with production configuration
docker-compose -f docker-compose.prod.yml up --build -d
```

### Environment Variables

Make sure to set these in your production environment:

```bash
# Backend (backend/.env)
DATABASE_URL=your_production_database_url
DIRECT_URL=your_production_direct_url
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
PORT=5000
NODE_ENV=production

# Frontend (optional, has defaults)
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Stop production services

```bash
docker-compose -f docker-compose.prod.yml down
```

## Useful Commands

### Rebuild specific service

```bash
# Rebuild backend only
docker-compose up -d --build backend

# Rebuild frontend only
docker-compose up -d --build frontend
```

### Check container status

```bash
# List running containers
docker-compose ps

# List all containers (including stopped)
docker ps -a

# Check resource usage
docker stats

# Inspect a container
docker inspect survey-backend
docker inspect survey-frontend
```

### Clean up Docker resources

```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Complete cleanup (use with caution)
docker system prune -a --volumes
```

## Troubleshooting

### Container won't start

1. Check logs: `docker-compose logs [service-name]`
2. Verify backend/.env file exists and has correct values
3. Ensure ports 3000 and 5000 are not already in use

**Check what's using a port:**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :3000
lsof -i :5000
```

### Database connection issues

1. Verify DATABASE_URL in backend/.env is correct
2. Check if Prisma client is generated: `docker-compose exec backend npx prisma generate`
3. Run migrations: `docker-compose exec backend npx prisma migrate dev`

### Module not found errors

1. Rebuild the containers: `docker-compose up --build`
2. Remove volumes and rebuild: `docker-compose down -v && docker-compose up --build`

### Hot reload not working

- Ensure volume mounts in docker-compose.yml are correct
- Check that node_modules is properly excluded with volume mounts
- Try restarting containers: `docker-compose restart`

### Port already in use

If you get "port already allocated" error:

```bash
# Stop conflicting services
docker-compose down

# Find and stop the process using the port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Start again
docker-compose up -d
```

## Docker Architecture

### Multi-stage Builds

Both Dockerfiles use multi-stage builds for optimization:

**Stages:**
1. **base** - Base Node.js image
2. **deps** - Install dependencies
3. **development** - Development environment with hot-reload
4. **builder** - Build the application (production only)
5. **production** - Optimized production image

### Volume Mounts (Development)

Development mode uses volume mounts for hot reloading:

**Backend:**
- `./backend/src` → `/app/src`
- `./backend/prisma` → `/app/prisma`

**Frontend:**
- `./frontend/app` → `/app/app`
- `./frontend/components` → `/app/components`
- `./frontend/lib` → `/app/lib`
- `./frontend/hooks` → `/app/hooks`

### Security Features

- Non-root users in production containers
- Health checks for production services
- Standalone Next.js output for optimized builds
- Environment variable isolation

## Notes

- Development mode uses volume mounts for hot reloading
- Production mode uses optimized builds with standalone Next.js output
- Both services run as non-root users in production for security
- Health checks are configured for production services
- Network isolation between services via Docker network
