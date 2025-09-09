# Use node version specified in .nvmrc
ARG NODE_VERSION=23.8.0
FROM node:${NODE_VERSION}-alpine AS base

# Ensure corepack is enabled and pnpm is on latest version
RUN corepack enable && corepack prepare pnpm@latest --activate

#------------------------------------------------------------------
#                         Build stage
#------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Copy ParaglideJS messages
COPY messages ./

# Copy source code
COPY . .

# Build the SvelteKit application
RUN pnpm run build

# Remove development-only dependencies from node_modules
RUN pnpm prune --prod

#------------------------------------------------------------------
#                         Production stage
#------------------------------------------------------------------
FROM base AS production
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 sveltekit

# Copy needed files from builder
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/static ./static
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./

# Switch to non-root user
USER sveltekit

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "build"]