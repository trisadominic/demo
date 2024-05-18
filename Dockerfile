# Use the official Node.js 16 image as a base
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install
                   
# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Command to run the application
CMD ["node", "server.js"]