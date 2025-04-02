// partidosRoutes.js
const express = require('express');
const router = express.Router();
const partidosController = require('../controllers/partidosController');

// router.get('/', entrenamientoController.getAllEntrenamientos);
// router.get('/actuales', entrenamientoController.getAllEntrenamientosByFecha);
// router.get('/:identrenamiento', entrenamientoController.getEntrenamientoById);
router.post('/', partidosController.createPartido);
// router.delete('/:identrenamiento', entrenamientoController.deleteEntrenamiento);
// router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);


module.exports = router;