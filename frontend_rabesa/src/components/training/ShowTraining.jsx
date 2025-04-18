import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  ImageListItem,
  Modal,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";

function ShowTraining() {
  const { identrenamiento } = useParams();
  const [datosEntrenamiento, setDatosEntrenamiento] = useState([]);
  const [datosAsistencia, setDatosAsistencia] = useState([]);
  const [datosNoAsistencia, setDatosNoAsistencia] = useState([]);
  const navigate = useNavigate();

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

  const handleDelete = async (idasistencia) => {
    let response = await fetch(
      apiUrl + "/entrenamientos/tipo/" + idasistencia,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const asistenciaTrasBorrado = datosAsistencia.filter(
        (asistencia) => asistencia.idasistencia != idasistencia
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatosAsistencia(asistenciaTrasBorrado);
      setDatosNoAsistencia(asistenciaTrasBorrado);
      navigate(0);
    }
  };

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

        <Link to={`/home/crear-confirmacion/${identrenamiento}/${true}`}>
          <Button variant="contained">Añadir asistencia</Button>
        </Link>

        <Link to={`/home/crear-confirmacion/${identrenamiento}/${false}`}>
          <Button variant="contained">Añadir no asistencia</Button>
        </Link>

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
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <img
                  src={`http://localhost:3000/uploads/${asistencia.idjugadora_jugadora.imagen}`}
                  style={{
                    borderRadius: "70%",
                    height: "100px",
                    width: "100px",
                    margin: "1rem",
                  }}
                ></img>
                <Typography gutterBottom component="div">
                  {asistencia.idjugadora_jugadora.nombre}
                </Typography>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleDelete(asistencia.idasistencia)}
                  >
                    Cancelar
                  </Button>
                </CardActions>
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
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <img
                  src={`http://localhost:3000/uploads/${noAsistencia.idjugadora_jugadora.imagen}`}
                  style={{
                    borderRadius: "70%",
                    height: "100px",
                    width: "100px",
                    margin: "1rem",
                  }}
                ></img>
                <Typography gutterBottom component="div">
                  {noAsistencia.idjugadora_jugadora.nombre}
                </Typography>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleDelete(noAsistencia.idasistencia)}
                  >
                    Cancelar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ShowTraining;
