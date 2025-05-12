# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port (Next.js default port)
EXPOSE 3000

# Start the service
CMD ["npm", "start"]