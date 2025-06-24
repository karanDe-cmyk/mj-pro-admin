# Stage 1: Build React App
FROM node:22-slim AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install --forcefully

# Copy source code and build the application
COPY . .
RUN npm run build

# Stage 2: Serve React App using Node.js
FROM node:22-alpine AS production
WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

# Copy built React files from previous stage
COPY --from=build /app/build ./build

# Expose port 3000 for the React app
EXPOSE 3000

# Start the static file server on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]