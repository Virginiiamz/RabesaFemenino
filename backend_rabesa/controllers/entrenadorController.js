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

  async getEntrenadorById(req, res) {
    const identrenador = req.params.identrenador;
    try {
      const entrenador = await Entrenador.findByPk(identrenador);

      const usuario = await Usuario.findByPk(entrenador.idusuario);

      const resultado = {
        idusuario: entrenador.idusuario,
        nombre: entrenador.nombre,
        edad: entrenador.edad,
        rol: entrenador.rol,
        fecha_ingreso: entrenador.fecha_ingreso,
        idclub: entrenador.idclub,
        correo: usuario.correo,
      };

      if (resultado) {
        res.json(Respuesta.exito(resultado, "Entrenador recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Entrenador no encontrado"));
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

  async createEntrenador(req, res) {
    const { correo, contrasena, nombre, edad, rol, fecha_ingreso, imagen, idclub } =
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
        imagen,
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

  async updateEntrenador(req, res) {
    const datos = req.body; // Recuperamos datos para actualizar
    const identrenador = req.params.identrenador; // dato de la ruta

    if (identrenador != datos.identrenador) {
      return res
        .status(400)
        .json(Respuesta.error(null, "El id del entrenador no coincide"));
    }

    try {
      const numFilas = await Entrenador.update(
        { ...datos },
        { where: { identrenador } }
      );

      const hashedPassword = await bcrypt.hash(datos.contrasena, 10);

      await Usuario.update(
        { correo: datos.correo, contrasena: hashedPassword },
        { where: { idusuario: datos.idusuario } }
      );

      if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(
            Respuesta.error(
              null,
              "No encontrado o no modificado: " + identrenador
            )
          );
      } else {
        // Al dar status 204 no se devuelva nada
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

module.exports = new EntrenadorController();
