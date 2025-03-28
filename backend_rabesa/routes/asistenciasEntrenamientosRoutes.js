// asistenciasEntrenamientos.js
const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/asistenciasEntrenamientosController');

router.get('/:identrenamiento', asistenciasController.getAllAsistenciaByEntrenamiento);
router.get('/jugadora/:idjugadora', asistenciasController.getAllEntrenamientosAsistidosByJugadora);
router.get('/noconfirmados/:idjugadora', asistenciasController.getEntrenamientosNoConfirmados);
router.post('/:identrenamiento/:idjugadora', asistenciasController.createAsistencia);
router.delete('/:idasistencia', asistenciasController.deleteAsistencia);
// router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);


module.exports = router;