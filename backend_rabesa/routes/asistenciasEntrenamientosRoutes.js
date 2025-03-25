// asistenciasEntrenamientos.js
const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/asistenciasEntrenamientosController');

// router.get('/', entrenamientoController.getAllEntrenamientos);
// router.get('/actuales', entrenamientoController.getAllEntrenamientosByFecha);
// router.get('/:identrenamiento', entrenamientoController.getEntrenamientoById);
router.get('/noconfirmados/:idjugadora', asistenciasController.getEntrenamientosNoConfirmados);
router.post('/:identrenamiento/:idjugadora', asistenciasController.createAsistencia);
// router.delete('/:identrenamiento', entrenamientoController.deleteEntrenamiento);
// router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);


module.exports = router;