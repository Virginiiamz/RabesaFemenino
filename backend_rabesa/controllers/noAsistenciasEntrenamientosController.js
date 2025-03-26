// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

const { Op, where } = require("sequelize");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo plato
const NoAsistencias = models.noAsistenciaEntrenamientos;
const Entrenamiento = models.entrenamientos;

class NoAsistenciasEntrenamientoController {
  // async getEntrenamientosNoConfirmados(req, res) {
  //   const { idjugadora } = req.params;

  //   console.log("IDJUGADORA: ", idjugadora);

  //   try {
  //     const resultados = await Entrenamiento.findAll({
  //       where: {
  //         identrenamiento: {
  //           [Op.notIn]: sequelize.literal(
  //             `(SELECT identrenamiento FROM asistencia_entrenamientos WHERE idjugadora = ${sequelize.escape(
  //               idjugadora
  //             )})`
  //           ),
  //         },
  //       },
  //       order: [["fecha_entrenamiento", "DESC"]],
  //     });

  //     console.log(resultados);

  //     res.json(
  //       Respuesta.exito(
  //         resultados,
  //         "Entrenamientos no confirmados recuperados correctamente"
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error detallado:", error);
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           "Error al obtener entrenamientos no confirmados",
  //           error.message
  //         )
  //       );
  //   }
  // }

  async getAllEntrenamientosNoAsistidosByJugadora(req, res) {
    const { idjugadora } = req.params;

    console.log("IDJUGADORA: ", idjugadora);

    try {
      const data = await Entrenamiento.findAll({
        include: [
          {
            model: NoAsistencias,
            as: "no_asistencia_entrenamientos",
            where: { idjugadora: idjugadora },
            required: true, // INNER JOIN (solo entrenamientos con asistencia de esta jugadora)
          },
        ],
        order: [["fecha_entrenamiento", "DESC"]],
      });

      console.log(data);

      res.json(
        Respuesta.exito(
          data,
          "Datos de entrenamientos no asistidos recuperados correctamente"
        )
      );
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los entrenamientos no asistidos: ${req.originalUrl}`
          )
        );
    }
  }

  // async getAllEntrenamientos(req, res) {
  //   try {
  //     const data = await Entrenamiento.findAll();
  //     res.json(Respuesta.exito(data, "Datos de entrenamientos recuperados"));
  //   } catch (err) {
  //     // Handle errors during the model call
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

  async createNoAsistencia(req, res) {
    const identrenamiento = req.params.identrenamiento;
    const idjugadora = req.params.idjugadora;

    console.log("IDENTRENAMIENTO:", identrenamiento);
    console.log("IDJUGADORA:", idjugadora);

    try {
      let noAsistencia = {
        identrenamiento,
        idjugadora,
      };

      const nuevaNoAsistencia = await NoAsistencias.create(noAsistencia);

      res
        .status(201)
        .json(
          Respuesta.exito(
            nuevaNoAsistencia,
            "Se ha confirmado que no vas asistir al entrenamiento"
          )
        );
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al confirmar que no vas asistir al entrenamiento`
          )
        );
    }
    // try {
    //   // Verificar si ya existe un entrenamiento en la misma fecha
    //   const existingEntrenamiento = await Entrenamiento.findOne({
    //     where: { fecha_entrenamiento },
    //   });

    //   if (existingEntrenamiento) {
    //     // Verificar si las horas se solapan
    //     const solapamiento = await Entrenamiento.findOne({
    //       where: {
    //         fecha_entrenamiento,
    //         [Op.or]: [
    //           // Caso 1: El nuevo entrenamiento no cruza la medianoche
    //           {
    //             [Op.and]: [
    //               { hora_inicio: { [Op.lt]: hora_final } },
    //               { hora_final: { [Op.gt]: hora_inicio } },
    //             ],
    //           },
    //           // Caso 2: El nuevo entrenamiento cruza la medianoche
    //           {
    //             [Op.and]: [
    //               { hora_inicio: { [Op.gte]: hora_final } },
    //               { hora_final: { [Op.lte]: hora_inicio } },
    //             ],
    //           },
    //         ],
    //       },
    //     });

    //     if (solapamiento) {
    //       return res
    //         .status(400)
    //         .json(
    //           Respuesta.error(
    //             null,
    //             "Ya existe un entrenamiento en esa fecha y las horas se solapan."
    //           )
    //         );
    //     }
    //   }

    //   // Crear el nuevo entrenamiento
    //   const entrenamiento = {
    //     fecha_entrenamiento,
    //     hora_inicio,
    //     hora_final,
    //     tipo,
    //     informacion,
    //   };

    //   console.log("entrenamiento", entrenamiento);

    //   const nuevoEntrenamiento = await Entrenamiento.create(entrenamiento);

    //   res
    //     .status(201)
    //     .json(
    //       Respuesta.exito(nuevoEntrenamiento, "Entrenamiento creado con éxito")
    //     );
    // } catch (err) {
    //   logMensaje("Error :" + err);
    //   res
    //     .status(500)
    //     .json(Respuesta.error(null, "Error al crear un entrenamiento nuevo"));
    // }
  }

  async deleteAsistencia(req, res) {
    const idasistencia = req.params.idasistencia;

    console.log("IDASISTENCIA: ", idasistencia);

    try {
      const asistencia = await Asistencias.findByPk(idasistencia);

      if (asistencia) {
        const numFilas = await Asistencias.destroy({
          where: {
            idasistencia: idasistencia,
          },
        });

        if (numFilas == 0) {
          // No se ha encontrado lo que se quería borrar
          res
            .status(404)
            .json(Respuesta.error(null, "No encontrado: " + idasistencia));
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

module.exports = new NoAsistenciasEntrenamientoController();
