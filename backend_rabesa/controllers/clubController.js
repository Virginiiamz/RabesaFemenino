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
// Recuperar el modelo plato
const Club = models.clubs;

class ClubController {
  async getAllClubs(req, res) {
    try {
      const data = await Club.findAll();
      res.json(Respuesta.exito(data, "Datos de clubes recuperados"));
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los clubs: ${req.originalUrl}`
          )
        );
    }
  }

  // async getAllEntrenamientosByFecha(req, res) {
  //   try {
  //     // Obtener la fecha actual del sistema (sin hora, solo fecha)
  //     const hoy = new Date();
  //     hoy.setHours(0, 0, 0, 0); // Establecer a medianoche para incluir todo el día

  //     const data = await Entrenamiento.findAll({
  //       where: {
  //         fecha_entrenamiento: {
  //           [Op.gte]: hoy, // Mayor o igual a hoy
  //         },
  //       },
  //       order: [["fecha_entrenamiento", "ASC"]], // Opcional: ordenar por fecha ascendente
  //     });

  //     res.json(
  //       Respuesta.exito(data, "Datos de entrenamientos futuros recuperados")
  //     );
  //   } catch (err) {
  //     // Manejar errores durante la consulta
  //     console.error(err);
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al recuperar los datos de los entrenamientos: ${req.originalUrl}`
  //         )
  //       );
  //   }
  // }

  // async getEntrenamientoById(req, res) {
  //   const identrenamiento = req.params.identrenamiento;
  //   try {
  //     const entrenamiento = await Entrenamiento.findByPk(identrenamiento);

  //     if (entrenamiento) {
  //       res.json(Respuesta.exito(entrenamiento, "Entrenamiento recuperado"));
  //     } else {
  //       res
  //         .status(404)
  //         .json(Respuesta.error(null, "Entrenamiento no encontrado"));
  //     }
  //   } catch (err) {
  //     logMensaje("Error :" + err);
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al recuperar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }
  // }

  // async createPartido(req, res) {
  //   const { idrival, resultado, ubicacion, hora, fecha_partido } = req.body;

  //   try {
  //     const partidosExistente = await Partido.findAll({
  //       where: { idrival: idrival },
  //       attributes: ["idpartido"],
  //     });

  //     if (partidosExistente.length >= 2) {
  //       return res
  //         .status(400)
  //         .json(
  //           Respuesta.error(
  //             null,
  //             "No se puede crear más de 2 partidos contra el mismo rival."
  //           )
  //         );
  //     }

  //     const nuevoPartido = await Partido.create({
  //       idrival,
  //       resultado,
  //       ubicacion,
  //       hora,
  //       fecha_partido,
  //     });

  //     res
  //       .status(201)
  //       .json(Respuesta.exito(nuevoPartido, "Partido creado exitosamente"));
  //   } catch (err) {
  //     console.error("Error al crear partido:", err);
  //     res
  //       .status(500)
  //       .json(Respuesta.error(null, "Error interno al crear el partido"));
  //   }
  // }

  // async deleteEntrenamiento(req, res) {
  //   const identrenamiento = req.params.identrenamiento;

  //   try {
  //     const entrenamiento = await Entrenamiento.findByPk(identrenamiento);

  //     if (entrenamiento) {
  //       const numFilas = await Entrenamiento.destroy({
  //         where: {
  //           identrenamiento: identrenamiento,
  //         },
  //       });

  //       if (numFilas == 0) {
  //         // No se ha encontrado lo que se quería borrar
  //         res
  //           .status(404)
  //           .json(Respuesta.error(null, "No encontrado: " + identrenamiento));
  //       } else {
  //         res.status(204).send();
  //       }
  //     }
  //   } catch (err) {
  //     logMensaje("Error :" + err);
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al eliminar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }
  // }

  // async updateEntrenamiento(req, res) {
  //   const datos = req.body;
  //   const identrenamiento = req.params.identrenamiento;

  //   console.log("📥 Datos recibidos en el backend:", datos); // 👈 DEBUG

  //   try {
  //     const entrenamientoSeleccionado = await Entrenamiento.findByPk(
  //       identrenamiento
  //     );

  //     // Comprobamos si la fecha o las horas han cambiado
  //     const haCambiadoHorario =
  //       entrenamientoSeleccionado.fecha_entrenamiento !==
  //         datos.fecha_entrenamiento ||
  //       entrenamientoSeleccionado.hora_inicio !== datos.hora_inicio ||
  //       entrenamientoSeleccionado.hora_final !== datos.hora_final;

  //     if (haCambiadoHorario) {
  //       const solapamiento = await Entrenamiento.findOne({
  //         where: {
  //           fecha_entrenamiento: datos.fecha_entrenamiento,
  //           identrenamiento: { [Op.ne]: identrenamiento }, // Excluir el mismo entrenamiento
  //           [Op.or]: [
  //             // Caso 1: Se solapa por inicio o fin
  //             {
  //               hora_inicio: { [Op.lt]: datos.hora_final },
  //               hora_final: { [Op.gt]: datos.hora_inicio },
  //             },
  //             // Caso 2: El nuevo horario engloba completamente otro
  //             {
  //               hora_inicio: { [Op.gte]: datos.hora_inicio },
  //               hora_final: { [Op.lte]: datos.hora_final },
  //             },
  //           ],
  //         },
  //       });

  //       if (solapamiento) {
  //         console.log("Conflicto detectado con otro entrenamiento.");
  //         return res
  //           .status(400)
  //           .json(
  //             Respuesta.error(
  //               null,
  //               "Las horas se solapan con otro entrenamiento en esa fecha."
  //             )
  //           );
  //       }
  //     }

  //     // Si todo está bien, actualizar el entrenamiento
  //     const [numFilas] = await Entrenamiento.update(
  //       { ...datos },
  //       { where: { identrenamiento } }
  //     );

  //     if (numFilas === 0) {
  //       console.log("⚠️ No se realizó ninguna modificación.");
  //       return res
  //         .status(404)
  //         .json(Respuesta.error(null, "No encontrado o no modificado."));
  //     }

  //     res.status(204).send();
  //   } catch (err) {
  //     console.error("Error en la actualización:", err);
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al actualizar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }
  // }
}

module.exports = new ClubController();
