-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 08-05-2025 a las 06:54:50
-- Versión del servidor: 8.0.39
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rabesafemenino`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia_entrenamientos`
--

CREATE TABLE `asistencia_entrenamientos` (
  `idasistencia` int NOT NULL,
  `idjugadora` int NOT NULL,
  `identrenamiento` int NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `asistencia_entrenamientos`
--

INSERT INTO `asistencia_entrenamientos` (`idasistencia`, `idjugadora`, `identrenamiento`, `estado`) VALUES
(154, 18, 33, 0),
(160, 18, 34, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clubs`
--

CREATE TABLE `clubs` (
  `idclub` int NOT NULL,
  `nombre` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ciudad` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `estadio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `puntos` int NOT NULL,
  `imagen` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `fecha_fundacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `clubs`
--

INSERT INTO `clubs` (`idclub`, `nombre`, `ciudad`, `estadio`, `puntos`, `imagen`, `fecha_fundacion`) VALUES
(1, 'Rabesa', 'Sevilla', 'Campo de Fútbol de Rabesa', 4, 'logo_rabesa.jpg', '2019-03-01'),
(2, 'Ciudad Alcala C.F.', 'Sevilla', 'Campo deportivo Oromana', 0, 'ciudad_alcala.png', '2021-01-01'),
(6, 'Sevilla FC', 'Sevilla 3', 'hola', 0, '1744640246568-null1.jpg', '2022-04-01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrenadores`
--

CREATE TABLE `entrenadores` (
  `identrenador` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `edad` int NOT NULL,
  `rol` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `imagen` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idclub` int NOT NULL,
  `idusuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `entrenadores`
--

INSERT INTO `entrenadores` (`identrenador`, `nombre`, `edad`, `rol`, `fecha_ingreso`, `imagen`, `idclub`, `idusuario`) VALUES
(23, 'entrenador1', 34, 'Entrenador', '2025-03-21', 'fotoentrenador.jpg', 1, 37),
(30, 'Pepe', 20, 'Segundo entrenador', '2025-05-01', 'null.webp', 1, 63),
(31, 'Entrenador 3', 20, 'Entrenador', '2025-05-05', 'null.webp', 1, 66);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrenamientos`
--

CREATE TABLE `entrenamientos` (
  `identrenamiento` int NOT NULL,
  `fecha_entrenamiento` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_final` time NOT NULL,
  `tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `informacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `entrenamientos`
--

INSERT INTO `entrenamientos` (`identrenamiento`, `fecha_entrenamiento`, `hora_inicio`, `hora_final`, `tipo`, `informacion`) VALUES
(12, '2025-04-07', '17:00:00', '18:30:00', '', ''),
(30, '2025-04-26', '12:00:00', '14:00:00', 'Integrado', 'Holaaaaa'),
(32, '2025-04-07', '19:00:00', '20:00:00', 'Técnico', 'njffff'),
(33, '2025-05-17', '11:00:00', '13:00:00', 'Físico', 'Fisico con balon'),
(34, '2025-05-20', '08:00:00', '11:00:00', 'Táctico', 'Holaaa'),
(39, '2025-05-15', '08:00:00', '09:00:00', 'Físico', ''),
(46, '2025-05-22', '11:00:00', '12:00:00', 'Mental y psicológico', 's');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadoras`
--

CREATE TABLE `jugadoras` (
  `idjugadora` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `edad` int NOT NULL,
  `posicion` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `numero_camiseta` int NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `imagen` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idclub` int NOT NULL,
  `idusuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `jugadoras`
--

INSERT INTO `jugadoras` (`idjugadora`, `nombre`, `edad`, `posicion`, `numero_camiseta`, `fecha_ingreso`, `estado`, `imagen`, `idclub`, `idusuario`) VALUES
(18, 'Virginia Campos Castro', 18, 'Portera', 11, '2025-04-02', 'Disponible', 'null.webp', 1, 52),
(26, 'Virginia Muñoz', 22, 'Extremo izquierdo', 2, '2025-05-05', 'Disponible', 'null.webp', 1, 64);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidos`
--

CREATE TABLE `partidos` (
  `idpartido` int NOT NULL,
  `idrival` int NOT NULL,
  `resultado` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ubicacion` varchar(500) COLLATE utf8mb3_spanish_ci NOT NULL,
  `hora` time NOT NULL,
  `fecha_partido` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `partidos`
--

INSERT INTO `partidos` (`idpartido`, `idrival`, `resultado`, `ubicacion`, `hora`, `fecha_partido`) VALUES
(18, 2, '2-1', 'ss', '14:00:00', '2025-04-26'),
(22, 2, '', 'ee', '14:00:00', '2025-04-19'),
(23, 6, '', 'Hola', '12:00:00', '2025-05-11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idusuario` int NOT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contrasena` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `rol` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `correo`, `contrasena`, `rol`) VALUES
(1, 'virginia@gmail.com', '$2b$10$.Chdcpq69o4Cx5cupF/hZ.QpVF9Ov9pGAGH0soEnNqILNZCR17BlW', 'Entrenador'),
(37, 'entrenador1@gmail.com', '$2b$10$AunNs5RRS1xwSX0A5xYyeudbFE.WTqFoQnoHpoCuH6qPh/P6mJH62', 'Entrenador'),
(52, 'chiquicampos@gmail.com', '$2b$10$hUW/Awz3YthYEVtq9D6zuuupwumStHHe6joYLCiAGFfGHVZE6DFHq', 'Jugadora'),
(63, 'entrenador2@gmail.com', '$2b$10$z9ohGZfX6KTeePA4jXGOOeQ4Qh.ne3czsOIA0vg7.On4gejKygXZC', 'Entrenador'),
(64, 'virginiamunoz@gmail.com', '$2b$10$39NwtcwSP5ENfcNCZXV9Ze.xprU5WzSNo6U7ZjY2wCYCQk2ZdfVXi', 'Jugadora'),
(66, 'entrenador3@gmail.com', '$2b$10$VWX7xFp2/yrLDx3hfkSAoulGPnPqYdC7BI.1vFsZjRIo4AGyyjYPm', 'Entrenador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencia_entrenamientos`
--
ALTER TABLE `asistencia_entrenamientos`
  ADD PRIMARY KEY (`idasistencia`),
  ADD KEY `idjugadora` (`idjugadora`),
  ADD KEY `identrenamiento` (`identrenamiento`);

--
-- Indices de la tabla `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`idclub`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  ADD PRIMARY KEY (`identrenador`),
  ADD KEY `idclub` (`idclub`),
  ADD KEY `idusuario` (`idusuario`);

--
-- Indices de la tabla `entrenamientos`
--
ALTER TABLE `entrenamientos`
  ADD PRIMARY KEY (`identrenamiento`);

--
-- Indices de la tabla `jugadoras`
--
ALTER TABLE `jugadoras`
  ADD PRIMARY KEY (`idjugadora`),
  ADD UNIQUE KEY `numero_camiseta` (`numero_camiseta`),
  ADD KEY `idclub` (`idclub`),
  ADD KEY `idusuario` (`idusuario`);

--
-- Indices de la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD PRIMARY KEY (`idpartido`),
  ADD KEY `idrival` (`idrival`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idusuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencia_entrenamientos`
--
ALTER TABLE `asistencia_entrenamientos`
  MODIFY `idasistencia` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT de la tabla `clubs`
--
ALTER TABLE `clubs`
  MODIFY `idclub` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  MODIFY `identrenador` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `entrenamientos`
--
ALTER TABLE `entrenamientos`
  MODIFY `identrenamiento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `jugadoras`
--
ALTER TABLE `jugadoras`
  MODIFY `idjugadora` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `partidos`
--
ALTER TABLE `partidos`
  MODIFY `idpartido` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia_entrenamientos`
--
ALTER TABLE `asistencia_entrenamientos`
  ADD CONSTRAINT `asistencia_entrenamientos_ibfk_1` FOREIGN KEY (`identrenamiento`) REFERENCES `entrenamientos` (`identrenamiento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `asistencia_entrenamientos_ibfk_2` FOREIGN KEY (`idjugadora`) REFERENCES `jugadoras` (`idjugadora`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  ADD CONSTRAINT `entrenadores_ibfk_1` FOREIGN KEY (`idclub`) REFERENCES `clubs` (`idclub`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `entrenadores_ibfk_2` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `jugadoras`
--
ALTER TABLE `jugadoras`
  ADD CONSTRAINT `jugadoras_ibfk_1` FOREIGN KEY (`idclub`) REFERENCES `clubs` (`idclub`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jugadoras_ibfk_2` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD CONSTRAINT `partidos_ibfk_1` FOREIGN KEY (`idrival`) REFERENCES `clubs` (`idclub`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
