// userRoutes.js
const multer = require("multer");
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verifyToken } = require("../middlewares/authMiddleware");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { initModels } = require("../models/init-models");
const sequelize = require("../config/sequelize");
require("dotenv").config();

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo user
const Usuario = models.usuario;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "rabesaFemenino/imagenes", // Carpeta en Cloudinary
    public_id: (req, file) => {
      // Nombre único para el archivo
      return `user_${Date.now()}_${file.originalname.split(".")[0]}`;
    },
  },
});

const upload = multer({ storage });

router.get("/verificar", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ mensaje: "No hay token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select("-contrasena");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Sesión válida",
      datos: {
        correo: usuario.correo,
        rol: usuario.rol,
        idusuario: usuario.idusuario, // Ajusta según tu modelo
      },
    });
  } catch (error) {
    console.error("Error en verificar:", error);
    res.status(401).json({ mensaje: "Token inválido" });
  }
});

router.post("/login", usuarioController.login);
router.put("/updateProfile", usuarioController.modifyUser);
router.put(
  "/updatePhoto",
  upload.single("imagen"),
  (err, req, res, next) => {
    console.error("[DEBUG] Error Multer:", err);
    return res.status(400).json({ mensaje: err.message });
  },
  usuarioController.modifyImagen
);
router.post("/logout", usuarioController.logout);

module.exports = router;
