// Importar libreria para manejo de ficheros de configuración dependiendo de la variable de entorno NODE_ENV
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

// Importar fichero de configuración con variables de entorno
const config = require("./config/config");
// Importar librería express --> web server
const express = require("express");
// Importar librería path, para manejar rutas de ficheros en el servidor
const path = require("path");
// Importar libreria CORS
const cors = require("cors");
// Importar librería de manejo de cookies
const cookieParser = require("cookie-parser");

// Importar gestores de rutas
const entrenadorRoutes = require("./routes/entrenadorRoutes");
const jugadoraRoutes = require("./routes/jugadoraRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const entrenamientoRoutes = require("./routes/entrenamientoRoutes");
const asistenciaEntrenRoutes = require("./routes/asistenciasEntrenamientosRoutes");
const partidoRoutes = require("./routes/partidosRoutes");
const clubRoutes = require("./routes/clubsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Configurar middleware para analizar JSON en las solicitudes
app.use(express.json());

// Configurar CORS para admitir cualquier origen
// app.use(cors()); // No permitite el envío de cookies en una API pública

if (process.env.NODE_ENV !== "production") {
  // Configurar CORS para admitir el origen del frontend en desarrollo
  app.use(
    cors({
      origin: "http://localhost:5173", // Permitir el frontend en desarrollo de React // Permitir el frontend en desarrollo de React Native
      credentials: true, // Permitir envío de cookies
    })
  );
}

// Habilitar el análisis de cookies
app.use(cookieParser());

// Configurar rutas de la API Rest
// app.use("/api/platos", platoRoutes);
// app.use("/api/pedidos", pedidoRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/entrenadores", entrenadorRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/jugadoras", jugadoraRoutes);
app.use("/api/entrenamientos", entrenamientoRoutes);
app.use("/api/entrenamientos/tipo", asistenciaEntrenRoutes);
app.use("/api/partidos", partidoRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Configurar el middleware para servir archivos estáticos desde el directorio 'public\old_js_vainilla'
app.use(express.static(path.join(__dirname, "public")));

//Ruta para manejar las solicitudes al archivo index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar el servidor solo si no estamos en modo de prueba
// en modo de prueba, el servidor se inicia en el archivo de prueba
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
  });
}

// Exportamos la aplicación para poder hacer pruebas
module.exports = app;
