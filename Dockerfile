# Stage 1: Multi-stage build for Vite + React
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL=/api
ARG VITE_USE_BACKEND=true
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_USE_BACKEND=${VITE_USE_BACKEND}

COPY package*.json ./
RUN npm ci || npm install

COPY . .

RUN npm run build

# Stage 2: Production web server with Nginx
FROM nginx:1.27-alpine

ENV PORT=80 \
    API_UPSTREAM=http://backend_consulting:8000 \
    MEDIA_UPSTREAM=http://backend_consulting:8000 \
    NGINX_ENVSUBST_FILTER="PORT|API_UPSTREAM|MEDIA_UPSTREAM"

# Clean up default config and inject template for dynamic envsubst
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy compiled SPA assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:${PORT}/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
