FROM oven/bun:latest

WORKDIR /app

# Copy root config files
COPY package.json bun.lock turbo.json ./

# Copy specific app files
COPY apps/backend ./apps/backend

# Copy other apps package.json to satisfy workspace requirements if needed (skipping for simplicity if possible, but safer to copy structure)
# For a simple setup, we often need the whole workspace structure or use turbo prune. 
# "Simple" requested: Copy everything (filtered by .dockerignore)
COPY . .

# Install system dependencies for native modules (like bcrypt)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN bun install

# Build the backend
WORKDIR /app/apps/backend
RUN bun run build

# Expose port (default NestJS port is often 3000, but we will configure it)
EXPOSE 3001

# Start the application
CMD ["bun", "run", "start:prod"]
