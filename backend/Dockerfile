# Backend multi-stage Dockerfile
# Build TypeScript and produce a small runtime image.

### Stage 1: build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
RUN npm ci --silent
COPY . .
RUN npm run build

### Stage 2: runtime
FROM node:18-slim
WORKDIR /app
ENV NODE_ENV=production
# Provide default port; can be overridden via Docker run/env
ENV PORT=4000

# Copy built files and production deps
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

# Required environment variables (set in your hosting provider or docker-compose):
# - DATABASE_URL (Postgres connection string)
# - JWT_SECRET
# - Any other envs used by your app (e.g., SENTRY_DSN)

CMD ["node", "dist/server.js"]
