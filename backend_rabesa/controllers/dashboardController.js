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
        order: [['fecha_entrenamiento', 'ASC'], ['hora_inicio', 'ASC']] // Ordenar por fecha y hora
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

  // async createClub(req, res) {
  //   const { nombre, ciudad, estadio, puntos, fecha_fundacion } = req.body;

  //   try {
  //     const nombreSinEspacios = nombre.trim();

  //     const fechaFundacion = new Date(fecha_fundacion);
  //     const fechaLimite = new Date(new Date().getFullYear() - 1, 5, 1); // 1 de junio del año pasado (mes 5 = junio)

  //     if (fechaFundacion >= fechaLimite) {
  //       return res.status(400).json({
  //         error: `La fecha de fundación debe ser anterior a junio del ${fechaLimite.getFullYear()}.`,
  //       });
  //     }

  //     const existingClub = await Club.findOne({
  //       where: { nombre: nombreSinEspacios },
  //     });

  //     if (existingClub) {
  //       return res
  //         .status(400)
  //         .json(Respuesta.error(null, "Ya existe un club con ese nombre."));
  //     } else {
  //       const imagen = req.file ? req.file.filename : "null.webp";

  //       const club = {
  //         nombre: nombreSinEspacios,
  //         ciudad,
  //         estadio,
  //         puntos,
  //         imagen,
  //         fecha_fundacion,
  //       };

  //       console.log("club: ", club);

  //       const nuevoClub = await Club.create(club);

  //       res
  //         .status(201)
  //         .json(Respuesta.exito(nuevoClub, "Club creado con éxito"));
  //     }
  //   } catch (err) {
  //     logMensaje("Error :" + err);
  //     res
  //       .status(500)
  //       .json(Respuesta.error(null, `Error al crear un club nuevo`));
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

module.exports = new DashboardController();
