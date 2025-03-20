import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../config";

function Team() {
  const [datosEntrenadores, setDatosEntrenadores] = useState([]);
  const [datosJugadoras, setDatosJugadoras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getEntrenadores() {
      let response = await fetch(apiUrl + "/entrenadores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
      });

      if (response.ok) {
        let data = await response.json();
        setDatosEntrenadores(data.datos);
      }
    }

    async function getJugadoras() {
      let response = await fetch(apiUrl + "/jugadoras", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
      });

      if (response.ok) {
        let data = await response.json();
        setDatosJugadoras(data.datos);
      }
    }

    getEntrenadores();
    getJugadoras();
  }, []); // Se ejecuta solo en el primer renderizado

  const handleDeleteEntrenadores = async (identrenador) => {
    let response = await fetch(apiUrl + "/entrenadores/" + identrenador, {
      method: "DELETE",
    });

    if (response.ok) {
      const entrenadoresTrasBorrado = datosEntrenadores.filter(
        (entrenador) => entrenador.identrenador != identrenador
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatosEntrenadores(entrenadoresTrasBorrado);
    }
  };

  const handleDeleteJugadoras = async (idjugadora) => {
    let response = await fetch(apiUrl + "/jugadoras/" + idjugadora, {
      method: "DELETE",
    });

    if (response.ok) {
      const jugadorasTrasBorrado = datosJugadoras.filter(
        (jugadora) => jugadora.idjugadora != idjugadora
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatosJugadoras(jugadorasTrasBorrado);
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
        <Link to="/home/crear-entrenador">
          <Button variant="contained">Crear entrenador</Button>
        </Link>
        <Link to="/home/crear-jugadora">
          <Button variant="contained">Crear jugadora</Button>
        </Link>
        <Typography sx={{ marginBottom: 2 }}>Entrenadores</Typography>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
            gap: 2,
          }}
        >
          {datosEntrenadores.map((entrenador) => (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt={entrenador.nombre}
                height="140"
                image={entrenador.imagen}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {entrenador.nombre}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entrenador.rol}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      "/home/modificar-entrenador/" + entrenador.identrenador
                    )
                  }
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  onClick={() =>
                    handleDeleteEntrenadores(entrenador.identrenador)
                  }
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
        <Typography sx={{ marginBottom: 2 }}>Jugadoras</Typography>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
            gap: 2,
          }}
        >
          {datosJugadoras.map((jugadora) => (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt={jugadora.nombre}
                height="140"
                image={jugadora.imagen}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {jugadora.nombre}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {jugadora.posicion}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      "/home/modificar-jugadora/" + jugadora.idjugadora
                    )
                  }
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  onClick={() =>
                    handleDeleteJugadoras(jugadora.idjugadora)
                  }
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Team;
