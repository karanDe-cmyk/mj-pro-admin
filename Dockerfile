# ------------ Stage 1: Build React App ------------ #
FROM node:22-slim AS build

# Setup working directory
WORKDIR /app

# Improve npm reliability inside Docker
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set registry https://registry.npmmirror.com

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build the app
COPY . .
RUN npm run build


# ------------ Stage 2: Serve React App ------------ #
FROM node:22-alpine AS production

WORKDIR /app

# Install static file server
RUN npm install -g serve

# Copy build output from previous stage
COPY --from=build /app/build ./build

# Optional: environment injection file
RUN touch /app/build/env.js

# Expose port
EXPOSE 3000

# Start server
CMD ["serve", "-s", "build", "-l", "3000"]
