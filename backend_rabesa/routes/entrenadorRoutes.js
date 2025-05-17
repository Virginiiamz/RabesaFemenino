// entrenadorRoutes.js
const multer = require("multer");
const express = require("express");
const router = express.Router();
const entrenadorController = require("../controllers/entrenadorController");
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

router.get("/", entrenadorController.getAllEntrenadores);
router.get("/:identrenador", entrenadorController.getEntrenadorById);
router.get("/datos/:idusuario", entrenadorController.getEntrenadorByIdUsuario);
router.post(
  "/",
  upload.single("imagen"),
  entrenadorController.createEntrenador
);
router.delete("/:identrenador", entrenadorController.deleteEntrenador);
router.put("/:identrenador", entrenadorController.updateEntrenador);

module.exports = router;
