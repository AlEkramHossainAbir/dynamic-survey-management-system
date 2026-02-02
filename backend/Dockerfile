# Backend Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Development stage
FROM base AS development
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Build stage for production
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

EXPOSE 5000

CMD ["npm", "start"]
