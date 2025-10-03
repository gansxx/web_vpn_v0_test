# ==================================
# Stage 1: Dependencies
# ==================================
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# ==================================
# Stage 2: Builder
# ==================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_DEV_MODE_ENABLED
ARG NEXT_PUBLIC_DISABLE_TURNSTILE
ARG NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE

# Export environment variables for build
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}
ENV NEXT_PUBLIC_DEV_MODE_ENABLED=${NEXT_PUBLIC_DEV_MODE_ENABLED}
ENV NEXT_PUBLIC_DISABLE_TURNSTILE=${NEXT_PUBLIC_DISABLE_TURNSTILE}
ENV NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE=${NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE}

# Build the Next.js application
RUN npm run build

# ==================================
# Stage 3: Runner
# ==================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
