// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

const { Op, STRING } = require("sequelize");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo plato
const Club = models.clubs;
const Jugadora = models.jugadoras;
const Entrenamiento = models.entrenamientos;
const Partido = models.partidos;

class DashboardController {
  async getTotalJugadoras(req, res) {
    try {
      const totalJugadoras = await Jugadora.count();

      res.json(
        Respuesta.exito(totalJugadoras, "Total de jugadoras en el club")
      );
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos del total de juagdoras: ${req.originalUrl}`
          )
        );
    }
  }

  async getTotalPuntosEquipo(req, res) {
    try {
      const totalPuntos = await Club.findByPk(1, {
        attributes: ["puntos"],
      });

      res.json(Respuesta.exito(totalPuntos, "Total de puntos en el club"));
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos del total de puntos: ${req.originalUrl}`
          )
        );
    }
  }

  async getProximoEntrenamiento(req, res) {
    try {
      const hoy = new Date();

      const proximoEntrenamiento = await Entrenamiento.findOne({
        where: {
          fecha_entrenamiento: {
            [Op.gt]: hoy, // Fecha mayor o igual a hoy
          },
        },
        order: [
          ["fecha_entrenamiento", "ASC"],
          ["hora_inicio", "ASC"],
        ], // Ordenar por fecha y hora
      });

      if (!proximoEntrenamiento) {
        return res
          .status(404)
          .json(
            Respuesta.error(null, "No hay entrenamientos programados a futuro")
          );
      }

      res.json(Respuesta.exito(proximoEntrenamiento, "Próximo entrenamiento"));
    } catch (err) {
      console.error("Error al obtener próximo entrenamiento:", err);
      res
        .status(500)
        .json(
          Respuesta.error(null, "Error al buscar el próximo entrenamiento")
        );
    }
  }

  async getPartidoDeLaSemana(req, res) {
    try {
      // 1. Obtener fechas de inicio y fin de la semana actual
      const hoy = new Date();
      const inicioSemana = new Date(hoy);
      inicioSemana.setHours(0, 0, 0, 0);
      // Ir al lunes de esta semana
      inicioSemana.setDate(
        hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1)
      );

      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6); // Domingo
      finSemana.setHours(23, 59, 59, 999);

      console.log("Rango semanal:", inicioSemana, "a", finSemana);

      // 2. Buscar partidos en este rango
      const partidos = await Partido.findAll({
        where: {
          fecha_partido: {
            [Op.between]: [inicioSemana, finSemana],
          },
        },
        order: [["fecha_partido", "ASC"]], // Ordenar por fecha más cercana
        include: [{ model: Club, as: "idrival_club" }],
      });

      // 3. Seleccionar el partido más próximo (partido de la semana)
      const partidoDeLaSemana = partidos.length > 0 ? partidos[0] : null;

      // 4. Responder
      if (!partidoDeLaSemana) {
        return res
          .status(200)
          .json(
            Respuesta.exito(
              null,
              "No hay partidos programados para esta semana"
            )
          );
      }

      res.json(
        Respuesta.exito(partidoDeLaSemana, "Partido de la semana recuperado")
      );
    } catch (error) {
      console.error("Error en getPartidoDeLaSemana:", error);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al obtener el partido de la semana: ${error.message}`
          )
        );
    }
  }

  async getClasificacion(req, res) {
    try {
      const clasificacion = await Club.findAll({
        order: [["puntos", "DESC"]],
      });

      res.json(
        Respuesta.exito(clasificacion, "Clasificacion de la liga recuperado")
      );
    } catch (error) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al obtener la clasificacion de la liga: ${error.message}`
          )
        );
    }
  }
}

module.exports = new DashboardController();
