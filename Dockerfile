# Use an official Node runtime as a parent image
FROM node:20.12.2 AS build

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build bcrypt
RUN npm rebuild bcrypt

# Second stage: Use a smaller Node image for production
FROM node:20.12.2-slim

WORKDIR /usr/src/app

# Copy compiled node modules and source code
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .

# Start your app
CMD [ "npm", "start" ]
