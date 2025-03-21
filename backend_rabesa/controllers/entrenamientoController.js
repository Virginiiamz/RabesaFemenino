// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

const { Op } = require("sequelize");

// Para comparar contraseñas cifradas
// const bcrypt = require("bcrypt");
// Librería de manejo de JWT
// const jwt = require("jsonwebtoken");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo plato
const Entrenamiento = models.entrenamientos;
// const Usuario = models.usuario;

class EntrenamientoController {
  async getAllEntrenamientos(req, res) {
    try {
      const data = await Entrenamiento.findAll();
      res.json(Respuesta.exito(data, "Datos de entrenamientos recuperados"));
    } catch (err) {
      // Handle errors during the model call
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los entrenamientos: ${req.originalUrl}`
          )
        );
    }
  }

  async getEntrenamientoById(req, res) {
    const identrenamiento = req.params.identrenamiento;
    try {
      const entrenamiento = await Entrenamiento.findByPk(identrenamiento);

      if (entrenamiento) {
        res.json(Respuesta.exito(entrenamiento, "Entrenamiento recuperado"));
      } else {
        res
          .status(404)
          .json(Respuesta.error(null, "Entrenamiento no encontrado"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  async createEntrenamiento(req, res) {
    const { fecha_entrenamiento, hora_inicio, hora_final, tipo, informacion } =
      req.body;

    try {
      // Verificar si ya existe un entrenamiento en la misma fecha
      const existingEntrenamiento = await Entrenamiento.findOne({
        where: { fecha_entrenamiento },
      });

      if (existingEntrenamiento) {
        // Verificar si las horas se solapan
        const solapamiento = await Entrenamiento.findOne({
          where: {
            fecha_entrenamiento,
            [Op.or]: [
              // Caso 1: El nuevo entrenamiento no cruza la medianoche
              {
                [Op.and]: [
                  { hora_inicio: { [Op.lt]: hora_final } },
                  { hora_final: { [Op.gt]: hora_inicio } },
                ],
              },
              // Caso 2: El nuevo entrenamiento cruza la medianoche
              {
                [Op.and]: [
                  { hora_inicio: { [Op.gte]: hora_final } },
                  { hora_final: { [Op.lte]: hora_inicio } },
                ],
              },
            ],
          },
        });

        if (solapamiento) {
          return res
            .status(400)
            .json(
              Respuesta.error(
                null,
                "Ya existe un entrenamiento en esa fecha y las horas se solapan."
              )
            );
        }
      }

      // Crear el nuevo entrenamiento
      const entrenamiento = {
        fecha_entrenamiento,
        hora_inicio,
        hora_final,
        tipo,
        informacion,
      };

      console.log("entrenamiento", entrenamiento);

      const nuevoEntrenamiento = await Entrenamiento.create(entrenamiento);

      res
        .status(201)
        .json(
          Respuesta.exito(nuevoEntrenamiento, "Entrenamiento creado con éxito")
        );
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, "Error al crear un entrenamiento nuevo"));
    }
  }

  async deleteEntrenamiento(req, res) {
    const identrenamiento = req.params.identrenamiento;

    try {
      const entrenamiento = await Entrenamiento.findByPk(identrenamiento);

      if (entrenamiento) {
        const numFilas = await Entrenamiento.destroy({
          where: {
            identrenamiento: identrenamiento,
          },
        });

        if (numFilas == 0) {
          // No se ha encontrado lo que se quería borrar
          res
            .status(404)
            .json(Respuesta.error(null, "No encontrado: " + identrenamiento));
        } else {
          res.status(204).send();
        }
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  async updateEntrenamiento(req, res) {
    const datos = req.body; // Recuperamos datos para actualizar
    const identrenamiento = req.params.identrenamiento; // dato de la ruta
    console.log("IdEntrenamiento: " + identrenamiento);

    try {
      const existingEntrenamiento = await Entrenamiento.findOne({
        where: { fecha_entrenamiento: datos.fecha_entrenamiento },
      });

      if (existingEntrenamiento) {
        // Verificar si las horas se solapan
        const solapamiento = await Entrenamiento.findOne({
          where: {
            fecha_entrenamiento: datos.fecha_entrenamiento,
            [Op.or]: [
              // Caso 1: El nuevo entrenamiento no cruza la medianoche
              {
                [Op.and]: [
                  { hora_inicio: { [Op.lt]: datos.hora_final } },
                  { hora_final: { [Op.gt]: datos.hora_inicio } },
                ],
              },
              // Caso 2: El nuevo entrenamiento cruza la medianoche
              {
                [Op.and]: [
                  { hora_inicio: { [Op.gte]: datos.hora_final } },
                  { hora_final: { [Op.lte]: datos.hora_inicio } },
                ],
              },
            ],
          },
        });

        if (solapamiento) {
          return res
            .status(400)
            .json(
              Respuesta.error(
                null,
                "Ya existe un entrenamiento en esa fecha y las horas se solapan."
              )
            );
        }
      }

      const numFilas = await Entrenamiento.update(
        { ...datos },
        { where: { identrenamiento } }
      );

      if (numFilas == 0) {
        console.log("404");

        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(
            Respuesta.error(
              null,
              "No encontrado o no modificado: " + identrenamiento
            )
          );
      } else {
        // Al dar status 204 no se devuelva nada
        console.log("204");

        res.status(204).send();
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar los datos: ${req.originalUrl}`
          )
        );
    }
  }
}

module.exports = new EntrenamientoController();
