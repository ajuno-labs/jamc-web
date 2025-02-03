# Use Node.js LTS (Latest LTS version for stability)
FROM node:20-alpine AS base

# Install dependencies needed for node-gyp and other build tools
RUN apk add --no-cache libc6-compat python3 make g++

# Install pnpm (as project uses pnpm)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Dependencies stage
FROM base AS deps
# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage (for production build, if needed)
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build (production settings)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client and build the application
RUN pnpm db:generate
RUN pnpm build

# Runner stage (for production, not used in local development)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables (production settings should be injected via docker-compose or env variables)
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the production application
CMD ["node", "server.js"]

# -------------------------------------------------------------------------------------------------
# Dev stage for local development. This stage is used by docker-compose for local development.
FROM base AS dev
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy full source code
COPY . .

# Expose port for development
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"]

# NOTE: Additional considerations:
# 1. Database migrations should be handled separately, not in the Dockerfile
# 2. Consider adding Redis for session storage in production
# 3. Add proper logging configuration for production
# 4. Consider implementing rate limiting for API routes
# 5. Set up proper CORS configuration
# 6. Implement proper caching strategy
# 7. Add monitoring and observability tools
# 8. Configure proper backup strategy for the database
# 9. Set up CDN for static assets
# 10. Implement proper security headers

# TODO: The following environment variables need to be properly configured in production:
# - AUTH_SECRET
# - AUTH_GOOGLE_ID
# - AUTH_GOOGLE_SECRET
# - DATABASE_URL 