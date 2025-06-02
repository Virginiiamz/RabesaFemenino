# Etapa 1: Construir el frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend_rabesa/ .
RUN npm install --force
RUN npm run build

# Etapa 2: Servidor backend con archivos frontend
FROM node:18
WORKDIR /app

# Copiamos el backend
COPY backend_rabesa/ .

# Copiamos el frontend ya compilado en la carpeta pública
COPY --from=build-frontend ./frontend_rabesa/dist ./backend_rabesa/public/

RUN npm install --force

# Expone el puerto (ajústalo si usas otro en el backend)
EXPOSE 3000

# Comando para iniciar el servidor Node.js
CMD ["npm", "start"]
