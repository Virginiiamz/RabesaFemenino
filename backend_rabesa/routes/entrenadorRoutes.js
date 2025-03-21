// entrenadorRoutes.js
const multer = require('multer');
const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
    },
    filename: function (req, file, cb) {
        // Generar un nombre único con la fecha + nombre original
        const uniqueSuffix = file.originalname;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({storage});

router.get('/', entrenadorController.getAllEntrenadores);
router.get('/:identrenador', entrenadorController.getEntrenadorById);
router.post('/',upload.single("imagen"), entrenadorController.createEntrenador);
router.delete('/:identrenador', entrenadorController.deleteEntrenador);
router.put('/:identrenador', entrenadorController.updateEntrenador);


module.exports = router;