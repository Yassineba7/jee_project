# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build static (CSR) — no SSR, no prerender
RUN npm run build

# ── Stage 2: Nginx pour servir les fichiers statiques ────────────────────────
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist/production-frontend/browser /usr/share/nginx/html

# Config Nginx : proxy /api → backend + SPA fallback
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
