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
const { where } = require("sequelize");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo plato
const Jugadora = models.jugadoras;
const Usuario = models.usuario;

class JugadoraController {
  async getAllJugadoras(req, res) {
    try {
      const data = await Jugadora.findAll();

      // Orden personalizado de posiciones
      const ordenPosiciones = [
        "Delantera",
        "Extremo izquierdo",
        "Extremo derecho",
        "Medio Centro",
        "Lateral izquierdo",
        "Lateral Derecho",
        "Central",
        "Portera",
      ];

      // Ordenar según el índice en ordenPosiciones
      const dataOrdenada = data.sort((a, b) => {
        const posA = ordenPosiciones.indexOf(a.posicion);
        const posB = ordenPosiciones.indexOf(b.posicion);
        return posA - posB;
      });

      res.json(Respuesta.exito(dataOrdenada, "Datos de jugadoras recuperadas"));
    } catch (err) {
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

  async getJugadoraByCorreo(req, res) {
    const { correo } = req.params;

    try {
      // Primero buscar el usuario por correo
      const usuario = await Usuario.findOne({
        where: { correo: correo },
      });

      if (!usuario) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // Luego buscar la jugadora asociada a ese usuario
      const jugadora = await Jugadora.findOne({
        where: { idusuario: usuario.idusuario },
      });

      if (!jugadora) {
        return res
          .status(404)
          .json(
            Respuesta.error(null, "Jugadora no encontrada para este usuario")
          );
      }

      // Construir el resultado combinado
      const resultado = {
        idjugadora: jugadora.idjugadora,
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

      res.json(Respuesta.exito(resultado, "Jugadora recuperada por correo"));
    } catch (err) {
      console.error("Error:", err);
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

  async getJugadoraByIdUsuario(req, res) {
    const { idusuario } = req.params;

    // Validación básica del parámetro
    if (!idusuario || isNaN(idusuario)) {
      return res
        .status(400)
        .json(
          Respuesta.error(null, "ID de usuario inválido o no proporcionado")
        );
    }

    try {
      // Buscar el entrenador asociado al usuario
      const jugadora = await Jugadora.findOne({
        where: { idusuario: idusuario },
      });

      if (!jugadora) {
        return res
          .status(404)
          .json(
            Respuesta.error(
              null,
              "No se encontró jugadora asociada a este usuario"
            )
          );
      }

      // Obtener datos del usuario
      const usuario = await Usuario.findByPk(idusuario);

      if (!usuario) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // Construir respuesta
      const resultado = {
        idjugadora: jugadora.idjugadora,
        idusuario: usuario.idusuario,
        nombre: jugadora.nombre,
        edad: jugadora.edad,
        posicion: jugadora.posicion,
        rol: usuario.rol,
        numero_camiseta: jugadora.numero_camiseta,
        fecha_ingreso: jugadora.fecha_ingreso,
        estado: jugadora.estado,
        imagen: jugadora.imagen,
        idclub: jugadora.idclub,
        correo: usuario.correo,
      };

      res.json(
        Respuesta.exito(resultado, "Datos de la jugadora recuperados con éxito")
      );
    } catch (err) {
      logMensaje(`Error en getJugadoraByIdUsuario: ${err.message}`);
      console.error(err.stack); // Log del stack completo para debugging

      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error interno al recuperar datos de la jugadora: ${err.message}`
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
      idclub,
    } = req.body;

    // Iniciar transacción
    const transaction = await sequelize.transaction();

    try {
      const totalJugadoras = await Jugadora.count({
        transaction,
      });

      if (totalJugadoras >= 25) {
        await transaction.rollback();
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "No se pueden registrar más de 25 jugadoras en el club."
            )
          );
      }

      const fechaIngreso = new Date(fecha_ingreso);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (isNaN(fechaIngreso.getTime())) {
        return res
          .status(400)
          .json(Respuesta.error(null, "La fecha de ingreso no es válida."));
      }

      if (fechaIngreso > hoy) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "La fecha de ingreso no puede ser mayor al día actual."
            )
          );
      }

      const existingNumeroCamiseta = await Jugadora.findOne({
        where: { numero_camiseta },
        transaction,
      });

      if (existingNumeroCamiseta) {
        await transaction.rollback(); // Rollback explícito (aunque no hay cambios aún)
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "Ya existe una jugadora con ese numero de camiseta."
            )
          );
      }

      const existingUser = await Usuario.findOne({
        where: { correo },
        transaction, // Incluir la transacción en la consulta
      });

      if (existingUser) {
        await transaction.rollback(); // Rollback explícito (aunque no hay cambios aún)
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "Ya existe un usuario con ese correo electrónico."
            )
          );
      }

      // 2. Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      // 3. Crear usuario (dentro de la transacción)
      const newUser = await Usuario.create(
        {
          correo,
          contrasena: hashedPassword,
          rol: "Jugadora",
        },
        { transaction }
      );

      // 4. Crear jugadora (dentro de la transacción)
      const imagen = req.file ? req.file.filename : "null.webp";
      const nuevaJugadora = await Jugadora.create(
        {
          nombre,
          edad,
          posicion,
          numero_camiseta,
          fecha_ingreso,
          estado,
          imagen,
          idclub,
          idusuario: newUser.idusuario,
        },
        { transaction }
      );

      // Si todo sale bien, confirmar la transacción
      await transaction.commit();

      // Eliminar contraseña de la respuesta
      delete newUser.dataValues.contrasena;

      res
        .status(201)
        .json(Respuesta.exito(nuevaJugadora, "Jugadora creada con éxito"));
    } catch (err) {
      // Si hay un error, revertir la transacción
      await transaction.rollback();
      logMensaje("Error en createJugadora: " + err);

      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            "Error al crear la jugadora. Ningún registro fue guardado."
          )
        );
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

  async updateJugadora(req, res) {
    const datos = req.body; // Recuperamos datos para actualizar
    const idjugadora = req.params.idjugadora; // dato de la ruta
    console.log("IdJugadora: " + idjugadora);

    try {
      const numFilas = await Jugadora.update(
        { ...datos },
        { where: { idjugadora } }
      );

      if (numFilas == 0) {
        console.log("404");

        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(
            Respuesta.error(
              null,
              "No encontrado o no modificado: " + idjugadora
            )
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

module.exports = new JugadoraController();
