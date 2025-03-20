// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta.js");
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
const Jugadora = models.jugadoras;
const Usuario = models.usuario;

class JugadoraController {
  async getAllJugadoras(req, res) {
    try {
      const data = await Jugadora.findAll();
      res.json(Respuesta.exito(data, "Datos de jugadoras recuperadas"));
    } catch (err) {
      // Handle errors during the model call
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de las jugadoras: ${req.originalUrl}`
          )
        );
    }
  }

  async getJugadoraById(req, res) {
    const idjugadora = req.params.idjugadora;
    try {
      const jugadora = await Jugadora.findByPk(idjugadora);

      const usuario = await Usuario.findByPk(jugadora.idusuario);

      const resultado = {
        idusuario: jugadora.idusuario,
        nombre: jugadora.nombre,
        edad: jugadora.edad,
        posicion: jugadora.posicion,
        numero_camiseta: jugadora.numero_camiseta,
        fecha_ingreso: jugadora.fecha_ingreso,
        estado: jugadora.estado,
        imagen: jugadora.imagen,
        idclub: jugadora.idclub,
        correo: usuario.correo,
      };

      if (resultado) {
        res.json(Respuesta.exito(resultado, "Jugadora recuperada"));
      } else {
        res.status(404).json(Respuesta.error(null, "Jugadora no encontrada"));
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

  async createJugadora(req, res) {
    const {
      correo,
      contrasena,
      nombre,
      edad,
      posicion,
      numero_camiseta,
      fecha_ingreso,
      estado,
      imagen,
      idclub,
    } = req.body;

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
        rol: "Jugadora",
      });

      // Responder con éxito
      delete newUser.dataValues.contrasena; // Eliminar la contraseña del objeto de respuesta

      const idusuario = newUser.dataValues.idusuario;

      console.log("idUsuario: " + idusuario);

      const jugadora = {
        nombre,
        edad,
        posicion,
        numero_camiseta,
        fecha_ingreso,
        estado,
        imagen,
        idclub,
        idusuario,
      };

      console.log("jugadora", jugadora);

      const nuevaJugadora = await Jugadora.create(jugadora);

      res
        .status(201)
        .json(Respuesta.exito(nuevaJugadora, "Jugadora creada con éxito"));
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear una jugadora nueva`));
    }
  }

  async deleteJugadora(req, res) {
    const idjugadora = req.params.idjugadora;

    try {
      const jugadora = await Jugadora.findByPk(idjugadora);

      if (jugadora) {
        const numFilas = await Jugadora.destroy({
          where: {
            idjugadora: idjugadora,
          },
        });

        await Usuario.destroy({
          where: {
            idusuario: jugadora.idusuario,
          },
        });
        if (numFilas == 0) {
          // No se ha encontrado lo que se quería borrar
          res
            .status(404)
            .json(Respuesta.error(null, "No encontrado: " + idjugadora));
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

  // async updateEntrenador(req, res) {
  //   const datos = req.body; // Recuperamos datos para actualizar
  //   const identrenador = req.params.identrenador; // dato de la ruta
  //   console.log("Identrenador: " + identrenador);
  //   console.log("Datos: " + datos);

  //   try {
  //     const numFilas = await Entrenador.update(
  //       { ...datos },
  //       { where: { identrenador } }
  //     );

  //     // const hashedPassword = await bcrypt.hash(datos.contrasena, 10);

  //     // await Usuario.update(
  //     //   { correo: datos.correo, contrasena: hashedPassword },
  //     //   { where: { idusuario: datos.idusuario } }
  //     // );

  //     if (numFilas == 0) {
  //       console.log("404");

  //       // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
  //       res
  //         .status(404)
  //         .json(
  //           Respuesta.error(
  //             null,
  //             "No encontrado o no modificado: " + identrenador
  //           )
  //         );
  //     } else {
  //       // Al dar status 204 no se devuelva nada
  //       console.log("204");

  //       res.status(204).send();
  //     }
  //   } catch (err) {
  //     logMensaje("Error :" + err);
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

module.exports = new JugadoraController();
