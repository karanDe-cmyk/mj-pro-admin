# Step 1: Build React App
FROM node:18 AS multiStage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:alpine

# Nginx config copy
COPY NGINX/default.conf /etc/nginx/conf.d/default.conf

# React build copy
COPY --from=multiStage /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
