# Use the official Node.js image as a base
FROM node:22.12.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY .env.local .env.local

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

RUN npm run clean

# Build the Next.js app
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 8080

# Start the Next.js app
CMD ["npm", "run", "start"]
