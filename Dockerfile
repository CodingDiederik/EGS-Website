# 1. Base image
FROM node:22-alpine AS base

# Install libc6-compat (Required for Next.js/SWC binaries)
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure environment is set during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# 4. Production Image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user (Best Practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copy the standalone folder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# --- DEBUGGING FIX ---
# Instead of assuming server.js is at root, we find it.
# Once you see the logs, you can switch back to CMD ["node", "path/to/server.js"]
CMD ["sh", "-c", "echo 'Current directory contents:' && ls -R && node server.js"]