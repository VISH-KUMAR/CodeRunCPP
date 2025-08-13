#!/bin/bash

# Build the Docker image for C++ execution
echo "Building Docker image for C++ execution..."
docker build -t cpp-runner ./docker

# Install dependencies
echo "Installing server dependencies..."
npm install

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo "Setup complete!"
echo "To run the application in development mode, use:"
echo "npm run dev-full"
echo ""
echo "Or to run with Docker Compose (recommended for security):"
echo "docker-compose up"
