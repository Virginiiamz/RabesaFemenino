// jugadoraRoutes.js
const multer = require("multer");
const express = require("express");
const router = express.Router();
const jugadoraController = require("../controllers/jugadoraController");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

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

router.get("/", jugadoraController.getAllJugadoras);
router.get("/:idjugadora", jugadoraController.getJugadoraById);
router.get("/datos/:idusuario", jugadoraController.getJugadoraByIdUsuario);
router.get("/correo/:correo", jugadoraController.getJugadoraByCorreo);
router.post("/", upload.single("imagen"), jugadoraController.createJugadora);
router.delete("/:idjugadora", jugadoraController.deleteJugadora);
router.put("/:idjugadora", jugadoraController.updateJugadora);

module.exports = router;
