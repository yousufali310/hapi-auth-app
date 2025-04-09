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


COPY --from=build /app/dist ./dist


COPY package.json package-lock.json ./
RUN npm install --production


EXPOSE 4173


CMD ["npx", "vite", "preview", "--port", "4173", "--host"]
