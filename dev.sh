#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker Desktop."
  exit 1
fi

echo "Starting FunctionalFinance locally..."

# Build and start services
docker-compose up --build
