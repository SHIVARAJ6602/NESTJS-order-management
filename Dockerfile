# syntax=docker/dockerfile:1

# Build stage
FROM node:22.13.1-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm npm ci --legacy-peer-deps

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22.13.1-slim AS final

# Set working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose application port
EXPOSE 8080

# Run the application
CMD ["node", "dist/main.js"]
