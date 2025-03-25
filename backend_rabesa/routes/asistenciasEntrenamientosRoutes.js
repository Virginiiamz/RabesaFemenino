// asistenciasEntrenamientos.js
const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/asistenciasEntrenamientosController');

// router.get('/', entrenamientoController.getAllEntrenamientos);
router.get('/jugadora/:idjugadora', asistenciasController.getAllEntrenamientosAsistidosByJugadora);
router.get('/noconfirmados/:idjugadora', asistenciasController.getEntrenamientosNoConfirmados);
router.post('/:identrenamiento/:idjugadora', asistenciasController.createAsistencia);
// router.delete('/:identrenamiento', entrenamientoController.deleteEntrenamiento);
// router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);


module.exports = router;