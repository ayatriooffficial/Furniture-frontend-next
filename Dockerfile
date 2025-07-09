# ------------ Base image for deps ------------
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci 


# ------------ Builder Stage (Next.js build) ------------
FROM node:18-alpine AS builder
WORKDIR /app

# Reuse deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG SKIP_API=false
ENV SKIP_API=${SKIP_API}
ENV NODE_ENV=production

RUN npm run build


# ------------ Final Production Runner ------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy essential runtime files
COPY --from=builder /app/public ./public
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000
CMD ["npm", "start"]
