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
  const [datos, setDatos] = useState([]);
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
        setDatos(data.datos);
      }
    }

    getEntrenadores();
  }, []); // Se ejecuta solo en el primer renderizado

  const handleDelete = async (identrenador) => {
    let response = await fetch(apiUrl + "/entrenadores/" + identrenador, {
      method: "DELETE",
    });

    if (response.ok) {
      const entrenadoresTrasBorrado = datos.filter(
        (entrenador) => entrenador.identrenador != identrenador
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatos(entrenadoresTrasBorrado);
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
          {datos.map((entrenador) => (
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
                  onClick={() => navigate("/home/modificar-entrenador/" + entrenador.identrenador)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDelete(entrenador.identrenador)}
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
