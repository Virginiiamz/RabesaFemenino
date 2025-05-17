// userRoutes.js
const multer = require("multer");
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verifyToken } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Carpeta donde se guardan los archivos
  },
  filename: function (req, file, cb) {
    // Generar un nombre único con la fecha + nombre original
    const uniqueSuffix = `${Date.now()}-${file.originalname.replace(
      /\s+/g,
      "_"
    )}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

router.post("/login", usuarioController.login);
router.put("/updateProfile", usuarioController.modifyUser);
router.put(
  "/updatePhoto",
  upload.single("imagen"),
  usuarioController.modifyImagen
);
// router.post("/logout", userController.logout);

module.exports = router;
