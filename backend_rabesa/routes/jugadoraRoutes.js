// jugadoraRoutes.js
const express = require('express');
const router = express.Router();
const jugadoraController = require('../controllers/jugadoraController');

router.get('/', jugadoraController.getAllJugadoras);
// router.get('/:identrenador', jugadoraController.getEntrenadorById);
router.post('/', jugadoraController.createJugadora);
// router.delete('/:identrenador', jugadoraController.deleteEntrenador);
// router.put('/:identrenador', jugadoraController.updateEntrenador);


module.exports = router;