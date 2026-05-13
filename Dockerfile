# syntax=docker/dockerfile:1.7

# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# lib/db/client.ts throws at import time if DATABASE_URL is unset, and
# `next build` evaluates server modules. Provide a placeholder so the build
# succeeds. Real value (if any) is injected at runtime via HF Space Secrets.
ENV DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat \
 && addgroup -g 1001 -S nodejs \
 && adduser  -u 1001 -S nextjs -G nodejs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# HF Spaces routes traffic to $PORT (defaults to 7860). Bind to 0.0.0.0
# so the container is reachable from outside.
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
EXPOSE 7860

CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "7860"]
