// userRoutes.js
const multer = require("multer");
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verifyToken } = require("../middlewares/authMiddleware");
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
// router.post("/logout", userController.logout);

module.exports = router;
