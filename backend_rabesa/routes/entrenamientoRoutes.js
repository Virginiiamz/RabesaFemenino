// entrenamientoRoutes.js
const express = require('express');
const router = express.Router();
const entrenamientoController = require('../controllers/entrenamientoController');

router.get('/', entrenamientoController.getAllEntrenamientos);
router.get('/buscar/:fechadesde/:fechahasta', entrenamientoController.getEntrenamientoByBusqueda);
router.get('/actuales', entrenamientoController.getEntrenamientoByFecha);
router.get('/:identrenamiento', entrenamientoController.getEntrenamientoById);
router.post('/', entrenamientoController.createEntrenamiento);
router.delete('/:identrenamiento', entrenamientoController.deleteEntrenamiento);
router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);


module.exports = router;