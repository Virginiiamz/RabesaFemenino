// partidosRoutes.js
const express = require('express');
const router = express.Router();
const clubsController = require('../controllers/clubController');

router.get('/', clubsController.getAllClubs);
// router.get('/actuales', entrenamientoController.getAllEntrenamientosByFecha);
// router.get('/:identrenamiento', entrenamientoController.getEntrenamientoById);
router.post('/', clubsController.createClub);
// router.delete('/:identrenamiento', entrenamientoController.deleteEntrenamiento);
// router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);


module.exports = router;