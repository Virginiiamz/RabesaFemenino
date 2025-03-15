// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo plato
const Entrenador = models.entrenadores;

class EntrenadorController {
  async createEntrenador(req, res) {
    const entrenador = req.body;

    try {
      const nuevoEntrenador = await Entrenador.create(entrenador);

      res
        .status(201)
        .json(Respuesta.exito(nuevoEntrenador, "Entrenador creado con éxito"));
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al crear un entrenador nuevo: ${entrenador}`
          )
        );
    }
  }
}

module.exports = new EntrenadorController();
