# syntax=docker/dockerfile:1

# Stage 1: Build Angular app
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG API_URL=http://localhost:8080/api
RUN sed -i "s|apiUrl: 'http://localhost:8080/api'|apiUrl: '$API_URL'|g" src/environments/environment.prod.ts && \
    npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/banking-frontend-angular/browser /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
