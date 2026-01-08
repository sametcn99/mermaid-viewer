FROM oven/bun:latest

WORKDIR /app

# Copy configuration files
COPY package.json bun.lock turbo.json ./

# Copy all source code (respecting .dockerignore)
COPY . .

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN bun install

# Set environment variables for build
ENV BUILD_CPU_LIMIT=1
ENV DISABLE_SOURCE_MAPS=true
ENV NEXT_TELEMETRY_DISABLED=1

# Build the frontend
WORKDIR /app/apps/frontend
RUN bun run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]