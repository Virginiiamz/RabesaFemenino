// dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/total-jugadoras", dashboardController.getTotalJugadoras);
router.get("/total-puntos", dashboardController.getTotalPuntosEquipo);
router.get("/total-partidos-jugados", dashboardController.getTotalPartidosJugados);
router.get("/proximo-entrenamiento", dashboardController.getProximoEntrenamiento);
router.get("/partido-semana", dashboardController.getPartidoDeLaSemana);
router.get("/clasificacion", dashboardController.getClasificacion);

module.exports = router;
