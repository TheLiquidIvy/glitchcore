# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm ci

COPY client/ .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

COPY --from=builder /app/client/build /app/build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["serve", "-s", "build", "-l", "5000"]
