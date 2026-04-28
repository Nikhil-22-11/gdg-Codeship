# ---- Stage 1: Build Frontend ----
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
# Copy frontend package files
COPY package.json package-lock.json* ./
RUN npm ci
# Copy frontend source
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./
RUN npm run build

# ---- Stage 2: Build Backend ----
FROM node:20-alpine AS backend-builder
WORKDIR /backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci
COPY backend/src ./src
COPY backend/tsconfig.json ./
RUN npm run build

# ---- Stage 3: Production Image ----
FROM node:20-alpine
WORKDIR /app

# Install only production backend dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# Copy compiled backend
COPY --from=backend-builder /backend/dist ./dist

# Copy compiled frontend to /dist (root level)
COPY --from=frontend-builder /frontend/dist /dist

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
