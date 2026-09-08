# Multi-stage build for Vite + React
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL
ARG VITE_USE_BACKEND
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_USE_BACKEND=${VITE_USE_BACKEND}

COPY package*.json ./
RUN npm ci || npm install

COPY . .

RUN npm run build
RUN echo "FRONTEND_BUILD_OK"


FROM nginx:1.27-alpine

ARG API_UPSTREAM=http://backend-consulting.railway.internal
ARG MEDIA_UPSTREAM=http://backend-consulting.railway.internal
ENV API_UPSTREAM=${API_UPSTREAM}
ENV MEDIA_UPSTREAM=${MEDIA_UPSTREAM}

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
