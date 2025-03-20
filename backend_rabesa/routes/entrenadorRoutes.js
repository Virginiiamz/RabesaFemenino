// entrenadorRoutes.js
const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');

router.get('/', entrenadorController.getAllEntrenadores);
router.get('/:identrenador', entrenadorController.getEntrenadorById);
router.post('/', entrenadorController.createEntrenador);
router.delete('/:identrenador', entrenadorController.deleteEntrenador);
router.put('/:identrenador', entrenadorController.updateEntrenador);


module.exports = router;