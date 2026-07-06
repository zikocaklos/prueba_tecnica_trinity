# syntax=docker/dockerfile:1

# Etapa 1: instalar dependencias y construir la app de Next.js
FROM node:22-alpine AS build
WORKDIR /app

# Copiar únicamente archivos de dependencias para aprovechar caché
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del proyecto y construir
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Etapa 2: imagen final para ejecutar la aplicación
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copiar los artefactos necesarios para ejecutar Next.js
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/postcss.config.cjs ./postcss.config.cjs
COPY --from=build /app/tailwind.config.cjs ./tailwind.config.cjs
COPY --from=build /app/next-env.d.ts ./next-env.d.ts
COPY --from=build /app/app ./app
COPY --from=build /app/src ./src

EXPOSE 3000
CMD ["sh", "-c", "npm run start -- --hostname 0.0.0.0 --port 3000"]
