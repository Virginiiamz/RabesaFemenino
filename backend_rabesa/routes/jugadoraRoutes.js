// jugadoraRoutes.js
const express = require('express');
const router = express.Router();
const jugadoraController = require('../controllers/jugadoraController');

router.get('/', jugadoraController.getAllJugadoras);
router.get('/:idjugadora', jugadoraController.getJugadoraById);
router.post('/', jugadoraController.createJugadora);
router.delete('/:idjugadora', jugadoraController.deleteJugadora);
// router.put('/:identrenador', jugadoraController.updateEntrenador);


module.exports = router;