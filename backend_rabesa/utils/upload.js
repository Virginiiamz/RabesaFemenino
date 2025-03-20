// utils/upload.js
const multer = require("multer");

// Configuración básica de multer (sin almacenamiento en disco, solo en memoria)
const upload = multer({
  storage: multer.memoryStorage(), // Almacena el archivo en memoria como un buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5 MB
  },
});

module.exports = upload;
