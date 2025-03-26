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
import { Link, useNavigate } from "react-router";
import useUserStore from "../stores/useUserStore";

function NoAssistedTraining() {
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

  const handleDelete = async (idasistencia) => {
    let response = await fetch(
      apiUrl + "/entrenamientos/asistencias/" + idasistencia,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const asistenciaTrasBorrado = datosConfirmados.filter(
        (asistencia) => asistencia.idasistencia != idasistencia
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatosConfirmados(asistenciaTrasBorrado);
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
        <Link to="/home/training">
          <Button variant="contained">Volver atras</Button>
        </Link>
        <Typography sx={{ marginBottom: 2 }}>
          Entrenamientos en los que no puede asistir
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
                    handleDelete(
                      entrenamiento.asistencia_entrenamientos[0].idasistencia
                    )
                  }
                >
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

export default NoAssistedTraining;
