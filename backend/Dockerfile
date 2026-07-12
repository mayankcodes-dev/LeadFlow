# ── Stage 1: Build ─────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Install ALL deps including devDependencies (typescript, ts-node, etc.)
RUN npm ci

COPY . .
# Now tsc is available
RUN npm run build

# ── Stage 2: Production image ───────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
# Only production deps in final image (keeps image small)
RUN npm ci --omit=dev

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
