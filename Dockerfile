# Optimized Next.js + Bun Dockerfile
FROM oven/bun:1 AS base
ENV NODE_ENV=production BUN_INSTALL_CACHE=/tmp/.bun-cache
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN --mount=type=cache,target=/tmp/.bun-cache bun install --frozen-lockfile

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Runtime
FROM base AS runtime
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

# Install curl for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN adduser --system --uid 1001 nextjs
USER nextjs
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Add health check with process check fallback
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://0.0.0.0:3000 2>/dev/null || curl -f http://127.0.0.1:3000 2>/dev/null || curl -f http://localhost:3000 2>/dev/null || pgrep -f "bun.*server.js" > /dev/null || exit 1

CMD ["bun", "server.js"]