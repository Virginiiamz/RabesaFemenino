import { Box, Button, Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../config";

function Training() {
  const [datosEntrenamientos, setDatosEntrenamientos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getEntrenamientos() {
      let response = await fetch(apiUrl + "/entrenamientos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
      });

      if (response.ok) {
        let data = await response.json();
        setDatosEntrenamientos(data.datos);
      }
    }

    getEntrenamientos();
  }, []); // Se ejecuta solo en el primer renderizado

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
        <Link to="/home/crear-entrenamiento">
          <Button variant="contained">Crear entrenamiento</Button>
        </Link>
        <Typography sx={{ marginBottom: 2 }}>Entrenamientos</Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {datosEntrenamientos.map((entrenamiento) => (
            <Card sx={{ maxWidth: 345 }}>
              {/* <CardMedia
                component="img"
                alt={entrenador.nombre}
                height="300"
                image={`http://localhost:3000/uploads/${entrenador.imagen}`}
              /> */}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Entrenamiento
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entrenamiento.fecha_entrenamiento}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entrenamiento.hora_inicio} - {entrenamiento.hora_final}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entrenamiento.tipo}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entrenamiento.informacion}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      "/home/modificar-entrenador/" +
                        entrenamiento.identrenamiento
                    )
                  }
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  onClick={() =>
                    handleDeleteEntrenadores(entrenamiento.identrenamiento)
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

export default Training;
