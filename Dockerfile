# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Final production image
FROM node:20-alpine
WORKDIR /app

# Copy backend production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy compiled backend
COPY --from=backend-builder /app/dist ./dist

# Copy compiled frontend into sibling `dist` folder (backend looks for ../../dist)
COPY --from=frontend-builder /app/dist /dist

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
