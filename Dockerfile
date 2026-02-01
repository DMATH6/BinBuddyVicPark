# Use official Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the server
CMD ["node", "backEnd/server.js"]
