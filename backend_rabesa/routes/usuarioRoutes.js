// userRoutes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/login", usuarioController.login);
router.put("/updateProfile", usuarioController.modifyUser);
// router.post("/signup", usuarioController.createUsuario);
// router.post("/logout", userController.logout);

module.exports = router;
