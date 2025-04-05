// dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/total-jugadoras", dashboardController.getTotalJugadoras);
router.get("/total-puntos", dashboardController.getTotalPuntosEquipo);
// router.get('/actuales', entrenamientoController.getAllEntrenamientosByFecha);
// router.get('/:identrenamiento', entrenamientoController.getEntrenamientoById);
// router.post("/", clubsController.createClub);
// router.delete('/:identrenamiento', entrenamientoController.deleteEntrenamiento);
// router.put('/:identrenamiento', entrenamientoController.updateEntrenamiento);

module.exports = router;
