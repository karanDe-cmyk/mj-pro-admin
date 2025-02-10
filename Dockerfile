# Stage 1: Build Stage
FROM node:22 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy source files and build the application
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets and copy built React files
RUN rm -rf ./*
COPY --from=build /app/build ./

# Expose the required port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]


