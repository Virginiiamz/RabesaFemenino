# Etapa 1: Construcción del frontend
FROM node:18 AS build-frontend
WORKDIR /app
COPY frontend_rabesa/ .
RUN npm install --force
RUN npm run build

# Etapa 2: Backend + frontend compilado
FROM node:18

# Crear carpeta de trabajo para el backend
WORKDIR /app

# Copiar todo el backend
COPY backend_rabesa/ .

# Copiar el frontend compilado al backend/public
COPY --from=build-frontend /app/dist ./public

# Instalar dependencias del backend
RUN npm install --force

# Expone el puerto que tu servidor usa (ajusta si usas otro)
EXPOSE 3000

# Ejecutar el servidor
CMD ["node", "index.js"]
