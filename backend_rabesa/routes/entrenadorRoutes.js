// platoRoutes.js
const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');

router.get('/', entrenadorController.getAllEntrenadores);
// router.get('/:idplato', platoController.getPlatoById);
router.post('/', entrenadorController.createEntrenador);
router.delete('/:identrenador', entrenadorController.deleteEntrenador);
// router.put('/:idplato', platoController.updatePlato);


module.exports = router;