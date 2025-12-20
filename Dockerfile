# Use Node base image
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build React app
RUN npm run build

# -----------------------------
# Stage 2: Production
# -----------------------------
FROM node:22-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/build ./build

# Expose port
EXPOSE 3000

# Start the app with serve
CMD ["serve", "-s", "build", "-l", "3000"]
