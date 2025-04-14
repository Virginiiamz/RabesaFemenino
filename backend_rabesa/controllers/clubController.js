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

class ClubController {
  async getAllClubs(req, res) {
    try {
      const data = await Club.findAll({
        where: {
          idclub: {
            [Op.ne]: 1, // Excluir el club del rabesa
          },
        },
      });
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

  async getClubById(req, res) {
    const idclub = req.params.idclub;
    try {
      const club = await Club.findByPk(idclub);

      if (club) {
        res.json(Respuesta.exito(club, "Club recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Club no encontrado"));
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

  async createClub(req, res) {
    const { nombre, ciudad, estadio, puntos, fecha_fundacion } = req.body;

    try {
      const nombreSinEspacios = nombre.trim();

      const fechaFundacion = new Date(fecha_fundacion);
      const fechaLimite = new Date(new Date().getFullYear() - 1, 5, 1); // 1 de junio del año pasado (mes 5 = junio)

      if (fechaFundacion >= fechaLimite) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              `La fecha de fundación debe ser anterior a junio del ${fechaLimite.getFullYear()}.`
            )
          );
      }

      const existingClub = await Club.findOne({
        where: { nombre: nombreSinEspacios },
      });

      if (existingClub) {
        return res
          .status(400)
          .json(Respuesta.error(null, "Ya existe un club con ese nombre."));
      } else {
        const imagen = req.file ? req.file.filename : "null1.jpg";

        const club = {
          nombre: nombreSinEspacios,
          ciudad,
          estadio,
          puntos,
          imagen,
          fecha_fundacion,
        };

        console.log("club: ", club);

        const nuevoClub = await Club.create(club);

        res
          .status(201)
          .json(Respuesta.exito(nuevoClub, "Club creado con éxito"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear un club nuevo`));
    }
  }

  async deleteClub(req, res) {
    const idclub = req.params.idclub;

    try {
      const club = await Club.findByPk(idclub);

      if (club) {
        const numFilas = await Club.destroy({
          where: {
            idclub: idclub,
          },
        });

        if (numFilas == 0) {
          // No se ha encontrado lo que se quería borrar
          res
            .status(404)
            .json(Respuesta.error(null, "No encontrado: " + idclub));
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

  async updateClub(req, res) {
    const datos = req.body;
    const idclub = req.params.idclub;

    try {
      const nombreSinEspacios = datos.nombre.trim();

      const existingClub = await Club.findOne({
        where: {
          nombre: nombreSinEspacios,
          idclub: { [Op.ne]: idclub }, // Excluir el club actual de la verificación
        },
      });

      if (existingClub) {
        return res
          .status(400)
          .json(Respuesta.error(null, "Ya existe un club con ese nombre."));
      } else {
        if (req.file) {
          datos.imagen = req.file.filename;
        } else {
          const club = await Club.findByPk(idclub);

          datos.imagen = club.imagen; // Mantener la imagen existente si no se proporciona una nueva
        }

        const club = {
          nombre: nombreSinEspacios,
          ciudad: datos.ciudad,
          estadio: datos.estadio,
          imagen: datos.imagen,
        };

        await Club.update(club, { where: { idclub } });

        res.status(204).send();
      }
    } catch (err) {
      console.error("Error en la actualización:", err);
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

module.exports = new ClubController();
