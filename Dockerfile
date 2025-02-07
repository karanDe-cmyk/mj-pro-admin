FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (cache this layer)
RUN npm install --production

# Copy all other source files
COPY . .

# Expose port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
