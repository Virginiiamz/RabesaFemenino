// platoRoutes.js
const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');

// router.get('/', platoController.getAllPlato);
// router.get('/:idplato', platoController.getPlatoById);
router.post('/', entrenadorController.createEntrenador);
// router.delete('/:idplato', platoController.deletePlato);
// router.put('/:idplato', platoController.updatePlato);


module.exports = router;