# Stage 1: Build React App
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy source code and build the application
COPY . .
RUN npm run build

# Stage 2: Serve React App using a lightweight Node.js image
FROM node:22-alpine AS production
WORKDIR /app

# Install serve (for serving static files)
RUN npm install -g serve

# Copy built React files from previous stage
COPY --from=build /app/build ./build

# Expose the required port
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "build", "-l", "3000"]
