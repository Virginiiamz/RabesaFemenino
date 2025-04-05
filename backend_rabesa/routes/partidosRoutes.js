// partidosRoutes.js
const express = require('express');
const router = express.Router();
const partidosController = require('../controllers/partidosController');

router.get('/', partidosController.getAllPartidosOrderByFecha);
router.get('/siguiente', partidosController.getPartidoBySemana);
router.get('/:idpartido', partidosController.getPartidoById);
router.post('/', partidosController.createPartido);
router.delete('/:idpartido', partidosController.deletePartido);
router.put('/:idpartido', partidosController.updatePartido);


module.exports = router;