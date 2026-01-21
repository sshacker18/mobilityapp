# Frontend multi-stage Dockerfile for Vite app

### Stage 1: build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

### Stage 2: serve
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Forward request logs to Docker log collector
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for serving static assets. You can override to 4173 if preferred.
EXPOSE 80

# Note: If your frontend needs to call the backend, set VITE_API_URL as an environment variable
# in your hosting provider or during build time. For Vite, use VITE_* prefix at build-time.

CMD ["nginx", "-g", "daemon off;"]
