# 🏗️ Build Stage: React App
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the React app
COPY . .
RUN npm run build


# 🚀 Production Stage: Serve via NGINX
FROM nginx:alpine

# Copy built React app from previous stage to NGINX default directory
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Custom NGINX config (used for React routing support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create empty env.js file to inject runtime environment variables
RUN touch /usr/share/nginx/html/env.js

# Expose port 80 (default for NGINX)
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
