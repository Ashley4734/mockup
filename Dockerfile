# Multi-stage build for Aurelia Galleria Mockup Generator
# Stage 1: Build React Application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Accept Replicate API Token as build argument
ARG VITE_REPLICATE_API_TOKEN
ENV VITE_REPLICATE_API_TOKEN=$VITE_REPLICATE_API_TOKEN

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production=false

# Copy configuration files
COPY vite.config.js tailwind.config.js postcss.config.js ./

# Copy source code and public files
COPY index.html ./
COPY src/ ./src/

# Build the application
RUN npm run build

# Stage 2: Production Server
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create favicon
RUN echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#F7F5F0" stroke="#D4C4B0" stroke-width="4"/><text x="50" y="60" text-anchor="middle" font-family="serif" font-size="28" fill="#8B7355">AG</text></svg>' > /usr/share/nginx/html/favicon.svg

# Expose port 80
EXPOSE 80

# Health check for Coolify
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Labels for container registry and Coolify
LABEL org.opencontainers.image.title="Aurelia Galleria Mockup Generator"
LABEL org.opencontainers.image.description="AI-powered mockup generator using FLUX Pro"
LABEL org.opencontainers.image.vendor="Aurelia Galleria"
LABEL coolify.port=80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]