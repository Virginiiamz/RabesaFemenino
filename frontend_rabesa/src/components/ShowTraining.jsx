import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiUrl } from "../config";

function ShowTraining() {
  const { identrenamiento } = useParams();
  const [datosEntrenamiento, setDatosEntrenamiento] = useState([]);
  const [datosAsistencia, setDatosAsistencia] = useState([]);
  const [datosNoAsistencia, setDatosNoAsistencia] = useState([]);

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
    async function getAllInformacionByIdEntrenamiento() {
      let responseEntrenamiento = await fetch(
        apiUrl + "/entrenamientos/" + identrenamiento,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (responseEntrenamiento.ok) {
        let data = await responseEntrenamiento.json();
        setDatosEntrenamiento(data.datos);
      }

      let responseAsistencias = await fetch(
        apiUrl + "/entrenamientos/tipo/" + identrenamiento,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (responseAsistencias.ok) {
        let data = await responseAsistencias.json();
        setDatosAsistencia(data.datos);
      }

      let responseNoAsistencias = await fetch(
        apiUrl + "/entrenamientos/tipo/no-asistidos/" + identrenamiento,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (responseNoAsistencias.ok) {
        let data = await responseNoAsistencias.json();
        setDatosNoAsistencia(data.datos);
      }
    }

    getAllInformacionByIdEntrenamiento();
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
          Entrenamiento:{" "}
          {formatearFecha(datosEntrenamiento.fecha_entrenamiento)}
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography gutterBottom component="div">
              Jugadoras que asisten
            </Typography>
            {datosAsistencia.map((asistencia) => (
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                  gap: 1,
                }}
              >
                <CardMedia
                  component="img"
                  alt={asistencia.idjugadora_jugadora.nombre}
                  height="100"
                  image={`http://localhost:3000/uploads/${asistencia.idjugadora_jugadora.imagen}`}
                />
                <CardContent>
                  <Typography gutterBottom component="div">
                    {asistencia.idjugadora_jugadora.nombre}
                  </Typography>
                </CardContent>
                <CardActions></CardActions>
              </Card>
            ))}
          </Box>
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography gutterBottom component="div">
              Jugadoras que no asisten
            </Typography>
            {datosNoAsistencia.map((noAsistencia) => (
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <CardMedia
                  component="img"
                  alt={noAsistencia.idjugadora_jugadora.nombre}
                  height="100"
                  image={`http://localhost:3000/uploads/${noAsistencia.idjugadora_jugadora.imagen}`}
                />
                <CardContent>
                  <Typography gutterBottom component="div">
                    {noAsistencia.idjugadora_jugadora.nombre}
                  </Typography>
                </CardContent>
                <CardActions></CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ShowTraining;
