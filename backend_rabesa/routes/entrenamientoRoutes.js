// entrenamientoRoutes.js
const express = require('express');
const router = express.Router();
const entrenamientoController = require('../controllers/entrenamientoController');

router.get('/', entrenamientoController.getAllEntrenamientos);
// router.get('/:identrenador', entrenamientoController.getEntrenadorById);
router.post('/', entrenamientoController.createEntrenamiento);
// router.delete('/:identrenador', entrenamientoController.deleteEntrenador);
router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);


module.exports = router;