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
// Importar fichero de configuración con variables de entorno
const config = require("../config/config.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo user
const Usuario = models.usuario;

class UsuarioController {
  async createUsuario(req, res) {
    const { correo, contrasena, rol } = req.body;

    try {
      // Validar si todos los campos fueron proporcionados
      if (!correo || !contrasena || !rol) {
        return res
          .status(400)
          .json(Respuesta.error(null, "Faltan campos por informar"));
      }

      // Verificar si el usuario ya existe
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
        rol,
      });

      // Responder con éxito
      delete newUser.dataValues.contrasena; // Eliminar la contraseña del objeto de respuesta
      res
        .status(201)
        .json(Respuesta.exito(newUser, "Usuario registrado exitosamente"));
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            "Error al registrar el usuario, intenta nuevamente"
          )
        );
    }
  }
}

module.exports = new UsuarioController();
