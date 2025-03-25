import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { useNavigate } from "react-router";
import useUserStore from "../stores/useUserStore";

function AssistedTraining() {
  const [datosConfirmados, setDatosConfirmados] = useState([]);
  const [datosJugadora, setDatosJugadora] = useState([]);
  const navigate = useNavigate();

  const { user } = useUserStore();

  useEffect(() => {
    async function getEntrenamientosConfirmados() {
      const jugadoraResponse = await fetch(
        apiUrl + "/jugadoras/correo/" + user.correo,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (jugadoraResponse.ok) {
        const jugadoraData = await jugadoraResponse.json();
        setDatosJugadora(jugadoraData.datos);

        const entrenamientosConfirmadosResponse = await fetch(
          apiUrl +
            "/entrenamientos/asistencias/jugadora/" +
            jugadoraData.datos.idjugadora,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (entrenamientosConfirmadosResponse.ok) {
          const entrenamientosConfirmadosData =
            await entrenamientosConfirmadosResponse.json();
          setDatosConfirmados(entrenamientosConfirmadosData.datos);
        }
      }
    }

    getEntrenamientosConfirmados();
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
          Entrenamientos confirmados
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {datosConfirmados.map((entrenamiento) => (
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Entrenamiento
                </Typography>
                {console.log(entrenamiento)}
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
                <Button size="small" onClick={() => navigate("/home/training")}>
                  Cancelar
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default AssistedTraining;
