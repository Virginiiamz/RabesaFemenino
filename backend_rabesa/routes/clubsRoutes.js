// clubsRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const clubsController = require("../controllers/clubController");
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

router.get("/", clubsController.getAllClubs);
router.get("/:idclub", clubsController.getClubById);
router.post("/", upload.single("imagen"), clubsController.createClub);
router.delete("/:idclub", clubsController.deleteClub);
router.put("/:idclub", upload.single("imagen"), clubsController.updateClub);

module.exports = router;
