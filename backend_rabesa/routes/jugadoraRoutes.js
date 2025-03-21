// jugadoraRoutes.js
const multer = require("multer");
const express = require("express");
const router = express.Router();
const jugadoraController = require("../controllers/jugadoraController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Carpeta donde se guardan los archivos
  },
  filename: function (req, file, cb) {
    // Generar un nombre único con la fecha + nombre original
    const uniqueSuffix = file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

router.get("/", jugadoraController.getAllJugadoras);
router.get("/:idjugadora", jugadoraController.getJugadoraById);
router.post("/", upload.single("imagen"), jugadoraController.createJugadora);
router.delete("/:idjugadora", jugadoraController.deleteJugadora);
router.put("/:idjugadora", jugadoraController.updateJugadora);

module.exports = router;
