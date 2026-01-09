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
ENV NODE_ENV=production

# Add ARGs for Next.js build time variables
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
# Add Coolify service URLs as potential fallbacks
ARG SERVICE_URL_BACKEND
ARG SERVICE_URL_FRONTEND
ARG SERVICE_FQDN_BACKEND
ARG SERVICE_FQDN_FRONTEND

# Make them available during build, using Coolify variables as fallback if explicit variables are missing
# Prefer FQDN (public) -> URL (internal/fallback)
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-${SERVICE_FQDN_FRONTEND:-$SERVICE_URL_FRONTEND}}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-${SERVICE_FQDN_BACKEND:-$SERVICE_URL_BACKEND}}

# Build the frontend
WORKDIR /app/apps/frontend
RUN bun run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]