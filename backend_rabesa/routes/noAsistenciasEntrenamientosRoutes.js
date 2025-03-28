// asistenciasEntrenamientos.js
const express = require('express');
const router = express.Router();
const noAsistenciasController = require('../controllers/noAsistenciasEntrenamientosController');

router.get('/:identrenamiento', noAsistenciasController.getAllNoAsistenciaByEntrenamiento);
router.get('/jugadora/:idjugadora', noAsistenciasController.getAllEntrenamientosNoAsistidosByJugadora);
// router.get('/noconfirmados/:idjugadora', asistenciasController.getEntrenamientosNoConfirmados);
router.post('/:identrenamiento/:idjugadora', noAsistenciasController.createNoAsistencia);
router.delete('/:idnoasistencia', noAsistenciasController.deleteNoAsistencia);
// router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);


module.exports = router;