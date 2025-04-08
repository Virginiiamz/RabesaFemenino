// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

const { Op } = require("sequelize");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
const Partido = models.partidos;
const Club = models.clubs;

class PartidosController {
  async getAllPartidosOrderByFecha(req, res) {
    try {
      const data = await Partido.findAll({
        order: [["fecha_partido", "ASC"]], // Ordenar por fecha ascendente
        include: [
          {
            model: Club,
            as: "idrival_club", // El rival
            required: true,
          },
        ],
      });
      res.json(Respuesta.exito(data, "Datos de partidos recuperados"));
    } catch (err) {
      // Handle errors during the model call
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los partidos: ${req.originalUrl}`
          )
        );
    }
  }

  async getPartidoById(req, res) {
    const idpartido = req.params.idpartido;
    try {
      const partido = await Partido.findByPk(idpartido, {
        include: [
          {
            model: Club,
            as: "idrival_club",
          },
        ],
      });

      if (partido) {
        res.json(Respuesta.exito(partido, "Partido recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Partido no encontrado"));
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

  async getPartidoBySemana(req, res) {
    try {
      const hoy = new Date();
      const diaActual = hoy.getDay(); // 0 (Domingo) a 6 (Sábado)

      // Ajustar para que la semana empiece en Lunes (1) y termine en Domingo (0)
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(
        hoy.getDate() - (diaActual === 0 ? 6 : diaActual - 1)
      ); // Lunes
      inicioSemana.setHours(0, 0, 0, 0); // Inicio del día (00:00:00)

      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6); // Domingo
      finSemana.setHours(23, 59, 59, 999); // Fin del día (23:59:59.999)

      const partidosSemana = await Partido.findAll({
        where: {
          fecha_partido: {
            [Op.between]: [inicioSemana, finSemana],
          },
        },
        // order: [["fecha_partido", "ASC"]], // Orden ascendente por fecha
      });

      res.json(
        Respuesta.exito(
          partidosSemana,
          "Partidos de la semana actual recuperado"
        )
      );
    } catch (err) {
      console.error("Error al obtener partido de la semana:", err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar el partido de la semana: ${err.message}`
          )
        );
    }
  }

  async createPartido(req, res) {
    const { idrival, resultado, ubicacion, hora, fecha_partido } = req.body;

    try {
      const partidosMismoRival = await Partido.findAll({
        where: { idrival: idrival },
        attributes: ["idpartido"],
      });

      if (partidosMismoRival.length >= 2) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "No se puede crear más de 2 partidos contra el mismo rival."
            )
          );
      }

      const fechaPartido = new Date(fecha_partido);
      const diaSemana = fechaPartido.getDay(); // 0 (domingo) a 6 (sábado)

      // Calcular inicio (lunes) y fin (domingo) de la semana
      const inicioSemana = new Date(fechaPartido);
      inicioSemana.setDate(
        fechaPartido.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)
      );
      inicioSemana.setHours(0, 0, 0, 0);

      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23, 59, 59, 999);

      const partidoEnSemana = await Partido.findOne({
        where: {
          fecha_partido: {
            [Op.between]: [inicioSemana, finSemana],
          },
        },
      });

      if (partidoEnSemana) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "Ya existe un partido programado en esta semana (lunes a domingo)."
            )
          );
      }

      const nuevoPartido = await Partido.create({
        idrival,
        resultado,
        ubicacion,
        hora,
        fecha_partido,
      });

      if (resultado != "") {
        const puntos = resultado.split("-");

        if (puntos[0] > puntos[1]) {
          const equipo = await Club.findOne({ where: { idclub: 1 } });

          let puntosFinal = equipo.puntos + 3;

          await Club.update({ puntos: puntosFinal }, { where: { idclub: 1 } });
        } else if (puntos[0] == puntos[1]) {
          const rabesa = await Club.findOne({ where: { idclub: 1 } });
          const equipoRival = await Club.findOne({
            where: { idclub: idrival },
          });

          let puntosRabesa = rabesa.puntos + 1;
          let puntosRival = equipoRival.puntos + 1;

          await Club.update({ puntos: puntosRabesa }, { where: { idclub: 1 } });

          await Club.update(
            { puntos: puntosRival },
            { where: { idclub: idrival } }
          );
        } else {
          const equipo = await Club.findOne({ where: { idclub: idrival } });

          let puntosFinal = equipo.puntos + 3;

          await Club.update(
            { puntos: puntosFinal },
            { where: { idclub: idrival } }
          );
        }
      }

      res
        .status(201)
        .json(Respuesta.exito(nuevoPartido, "Partido creado exitosamente"));
    } catch (err) {
      console.error("Error al crear partido:", err);
      res
        .status(500)
        .json(Respuesta.error(null, "Error interno al crear el partido"));
    }
  }

  async deletePartido(req, res) {
    const idpartido = req.params.idpartido;

    try {
      const partido = await Partido.findByPk(idpartido);

      if (partido) {
        if (partido.resultado != "") {
          const puntos = partido.resultado.split("-");

          if (puntos[0] > puntos[1]) {
            const equipo = await Club.findOne({ where: { idclub: 1 } });

            let puntosFinal = equipo.puntos - 3;

            await Club.update(
              { puntos: puntosFinal },
              { where: { idclub: 1 } }
            );
          } else if (puntos[0] == puntos[1]) {
            const rabesa = await Club.findOne({ where: { idclub: 1 } });
            const equipoRival = await Club.findOne({
              where: { idclub: partido.idrival },
            });

            let puntosRabesa = rabesa.puntos - 1;
            let puntosRival = equipoRival.puntos - 1;

            await Club.update(
              { puntos: puntosRabesa },
              { where: { idclub: 1 } }
            );

            await Club.update(
              { puntos: puntosRival },
              { where: { idclub: partido.idrival } }
            );
          } else {
            const equipo = await Club.findOne({
              where: { idclub: partido.idrival },
            });

            let puntosFinal = equipo.puntos - 3;

            await Club.update(
              { puntos: puntosFinal },
              { where: { idclub: partido.idrival } }
            );
          }
        }

        const numFilas = await Partido.destroy({
          where: {
            idpartido: idpartido,
          },
        });

        if (numFilas == 0) {
          // No se ha encontrado lo que se quería borrar
          res
            .status(404)
            .json(Respuesta.error(null, "No encontrado: " + idpartido));
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

  async updatePartido(req, res) {
    const datos = req.body; // Recuperamos datos para actualizar
    const idpartido = req.params.idpartido; // dato de la ruta
    console.log("IDPARTIDO: " + idpartido);

    try {
      // const partidosMismoRival = await Partido.findAll({
      //   where: { idrival: idrival },
      //   attributes: ["idpartido"],
      // });

      // if (partidosMismoRival.length >= 2) {
      //   return res
      //     .status(400)
      //     .json(
      //       Respuesta.error(
      //         null,
      //         "No se puede crear más de 2 partidos contra el mismo rival."
      //       )
      //     );
      // }

      // const fechaPartido = new Date(fecha_partido);
      // const diaSemana = fechaPartido.getDay(); // 0 (domingo) a 6 (sábado)

      // // Calcular inicio (lunes) y fin (domingo) de la semana
      // const inicioSemana = new Date(fechaPartido);
      // inicioSemana.setDate(
      //   fechaPartido.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)
      // );
      // inicioSemana.setHours(0, 0, 0, 0);

      // const finSemana = new Date(inicioSemana);
      // finSemana.setDate(inicioSemana.getDate() + 6);
      // finSemana.setHours(23, 59, 59, 999);

      // const partidoEnSemana = await Partido.findOne({
      //   where: {
      //     fecha_partido: {
      //       [Op.between]: [inicioSemana, finSemana],
      //     },
      //   },
      // });

      // if (partidoEnSemana) {
      //   return res
      //     .status(400)
      //     .json(
      //       Respuesta.error(
      //         null,
      //         "Ya existe un partido programado en esta semana (lunes a domingo)."
      //       )
      //     );
      // }

      const numFilas = await Partido.update(
        { ...datos },
        { where: { idpartido } }
      );

      if (numFilas == 0) {
        console.log("404");

        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(
            Respuesta.error(null, "No encontrado o no modificado: " + idpartido)
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

module.exports = new PartidosController();
