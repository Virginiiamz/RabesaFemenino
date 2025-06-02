# Usa Node.js como base
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /

# Copia el backend al contenedor
COPY ./backend_rabesa/ .

# Copia el frontend compilado a la carpeta "public" del backend
COPY ./frontend_rabesa/dist ./public

# Instala las dependencias del backend
RUN npm install --force

# Expone el puerto que usa tu servidor (ajústalo si es otro)
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "start"]
