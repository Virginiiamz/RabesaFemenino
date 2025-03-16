// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Para comparar contraseñas cifradas
const bcrypt = require("bcrypt");
// Librería de manejo de JWT
const jwt = require("jsonwebtoken");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo plato
const Entrenador = models.entrenadores;
const Usuario = models.usuario;

class EntrenadorController {
  async getAllEntrenadores(req, res) {
    try {
      const data = await Entrenador.findAll();
      res.json(Respuesta.exito(data, "Datos de entrenadores recuperados"));
    } catch (err) {
      // Handle errors during the model call
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los entrenadores: ${req.originalUrl}`
          )
        );
    }
  }

  async createEntrenador(req, res) {
    const { correo, contrasena, nombre, edad, rol, fecha_ingreso, idclub } =
      req.body;
    // const entrenador = req.body;

    try {
      const existingUser = await Usuario.findOne({ where: { correo } });
      if (existingUser) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "Ya existe un usuario con ese correo electrónico."
            )
          );
      }

      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el nivel de "salting" (puedes ajustarlo)

      // Crear el nuevo usuario
      const newUser = await Usuario.create({
        correo,
        contrasena: hashedPassword, // Guardamos la contraseña cifrada
        rol: "Entrenador",
      });

      // Responder con éxito
      delete newUser.dataValues.contrasena; // Eliminar la contraseña del objeto de respuesta

      const idusuario = newUser.dataValues.idusuario;

      console.log("idUsuario: " + idusuario);

      const entrenador = {
        nombre,
        edad,
        rol,
        fecha_ingreso,
        idclub,
        idusuario,
      };

      console.log("entrenador", entrenador);

      const nuevoEntrenador = await Entrenador.create(entrenador);

      res
        .status(201)
        .json(Respuesta.exito(nuevoEntrenador, "Entrenador creado con éxito"));
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear un entrenador nuevo`));
    }
  }

  async deleteEntrenador(req, res) {
    const identrenador = req.params.identrenador;

    try {
      const entrenador = await Entrenador.findByPk(identrenador);

      if (entrenador) {
        const numFilas = await Entrenador.destroy({
          where: {
            identrenador: identrenador,
          },
        });

        await Usuario.destroy({
          where: {
            idusuario: entrenador.idusuario,
          },
        });
        if (numFilas == 0) {
          // No se ha encontrado lo que se quería borrar
          res
            .status(404)
            .json(Respuesta.error(null, "No encontrado: " + identrenador));
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
}

module.exports = new EntrenadorController();
