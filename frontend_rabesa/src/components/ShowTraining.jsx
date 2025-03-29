import { Box, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiUrl } from "../config";

function ShowTraining() {
  const { identrenamiento } = useParams();
  const [datosEntrenamiento, setDatosEntrenamiento] = useState([]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const opciones = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    let fechaStr = new Date(fecha).toLocaleDateString("es-ES", opciones);

    fechaStr = fechaStr.replace(/\b\w/g, (letra, indice) => {
      if (indice === 0 || fechaStr.substring(indice - 3, indice) === "de ") {
        return letra.toUpperCase();
      }
      return letra;
    });

    return fechaStr;
  };

  useEffect(() => {
    async function getEntrenamientoById() {
      let response = await fetch(
        apiUrl + "/entrenamientos/" + identrenamiento,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        let data = await response.json();
        setDatosEntrenamiento(data.datos);
      }
    }

    getEntrenamientoById();
  }, []);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />

        <Typography sx={{ marginBottom: 2 }}>
          Entrenamiento: {formatearFecha(datosEntrenamiento.fecha_entrenamiento)}
        </Typography>
      </Box>
    </>
  );
}

export default ShowTraining;
