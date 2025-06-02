// Importar libreria para manejo de ficheros de configuración dependiendo de la variable de entorno NODE_ENV
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

module.exports = {
  port: process.env.PORT || 80,
  db: {
    host: process.env.DB_HOST || "yamabiko.proxy.rlwy.net",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "DoCqrfFwsYeXDTLtZpSTHSyjpvgJEtVZ",
    name: process.env.DB_NAME || "rabesafemenino",
    port: process.env.DB_PORT || 34243,
  },
  secretKey: process.env.SECRET_KEY || "default_secret",
};
