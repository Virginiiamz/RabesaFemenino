// clubsRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const clubsController = require("../controllers/clubController");

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

router.get("/", clubsController.getAllClubs);
router.get("/:idclub", clubsController.getClubById);
router.post("/", upload.single("imagen"), clubsController.createClub);
router.delete("/:idclub", clubsController.deleteClub);
router.put('/:idclub', upload.single("imagen"), clubsController.updateClub);

module.exports = router;
