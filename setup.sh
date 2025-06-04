#!/usr/bin/env bash
set -e

# JAMC project setup script

# Ensure pnpm is installed
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required but was not found. Installing globally via npm." >&2
  npm install -g pnpm
fi

# Create environment file if it does not exist
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example. Please update the values as needed."
fi

# Install Node.js dependencies
pnpm install

# Start docker services if docker is available
if command -v docker >/dev/null 2>&1; then
  echo "Starting docker services defined in compose.yaml..."
  docker compose up -d
else
  echo "Docker not found. Skipping container startup." >&2
fi

# Run database migrations and seed data
pnpm db:migrate
pnpm db:seed

echo "Setup complete. Use 'pnpm dev' to start the development server."
