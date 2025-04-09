# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build


# Stage 2: Production Image
FROM node:20-alpine AS production

WORKDIR /app

# Only copy the required files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Environment Variables will be injected at runtime (Best Practice)
# Pass .env file during docker run instead of baking into image.

EXPOSE 5000

CMD ["node", "dist/index.js"]
