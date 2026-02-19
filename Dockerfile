# Use official Node.js runtime as base image
FROM node:18-bookworm

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of application code
COPY . .

# Expose the port (default 8001 for this project)
EXPOSE 8001

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/server.js"]
