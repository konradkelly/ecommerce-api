FROM node:18-bookworm

WORKDIR /app

COPY package*.json package-lock.json ./

# Install dependencies before setting NODE_ENV=production
RUN npm ci --omit=dev

COPY . .

EXPOSE 8001

# Set production after install
ENV NODE_ENV=production

CMD ["node", "src/server.js"]