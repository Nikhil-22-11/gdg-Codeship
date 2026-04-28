FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy backend dependencies
COPY --from=backend-builder /app/package*.json ./
RUN npm ci --only=production
# Copy backend built files
COPY --from=backend-builder /app/dist ./dist
# Copy frontend built files
COPY --from=frontend-builder /app/dist ../dist

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
