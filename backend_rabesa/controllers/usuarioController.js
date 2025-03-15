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
  async login(req, res) {
    const { correo, contrasena } = req.body;

    try {
      const user = await Usuario.findOne({ where: { correo } });
      if (!user) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // Verificar la contraseña
      const validPassword = await bcrypt.compare(contrasena, user.contrasena);
      if (!validPassword) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Contraseña incorrecta"));
      }

      // Generar el token JWT
      const token = jwt.sign(
        {
          sub: user.idusuario,
          correo: user.correo,
          rol: user.rol,
        },
        config.secretKey,
        { expiresIn: "1h" }
      );

      // Configurar la cookie con el token
      res.cookie("token", token, {
        httpOnly: true, // Evita que JavaScript acceda a la cookie
        secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "Lax", // Protección CSRF // Lax en desarrollo
        maxAge: 3600000, // 1 hora en milisegundos
        // domain: "localhost",
      });

      //Eliminar la contraseña del objeto de respuesta
      delete user.dataValues.contrasena;

      res.status(200).json(Respuesta.exito(user, "Inicio de sesión exitoso"));
    } catch (err) {
      console.error(err);
      res.status(500).json(Respuesta.error(null, "Error interno del servidor"));
    }
  }
  
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
