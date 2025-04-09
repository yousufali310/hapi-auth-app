# Stage 1: Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Copy .env for Vite build
COPY .env .env

# Build the project
RUN npm run build


# Stage 2: Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy build output from previous stage
COPY --from=build /app/dist ./dist

# Install only production dependencies (if needed)
COPY package.json package-lock.json ./
RUN npm install --production

# Expose Vite preview port
EXPOSE 4173

# Start the app
CMD ["npx", "vite", "preview", "--port", "4173", "--host"]
