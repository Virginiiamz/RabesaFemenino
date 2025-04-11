import { Avatar, Box, Grid, Paper, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { apiUrl } from "../config";

function Dashboard() {
  const [totalJugadoras, setTotalJugadoras] = useState([]);
  const [totalPartidosJugados, setTotalPartidosJugados] = useState([]);
  const [totalPuntos, setTotalPuntos] = useState([]);
  const [proximoEntrenamiento, setProximoEntrenamiento] = useState([]);
  const [partidoSemana, setPartidoSemana] = useState([]);
  const [clasificacion, setClasificacion] = useState([]);

  useEffect(() => {
    async function getTotalJugadoras() {
      let response = await fetch(apiUrl + "/dashboard/total-jugadoras", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setTotalJugadoras(data.datos);
      }
    }

    async function getTotalPartidosFinalizados() {
      let response = await fetch(apiUrl + "/dashboard/total-partidos-jugados", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setTotalPartidosJugados(data.datos);
      }
    }

    async function getTotalPuntos() {
      let response = await fetch(apiUrl + "/dashboard/total-puntos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setTotalPuntos(data.datos);
      }
    }

    async function getProximoEntrenamiento() {
      let response = await fetch(apiUrl + "/dashboard/proximo-entrenamiento", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setProximoEntrenamiento(data.datos);
      }
    }

    async function getPartidoSemana() {
      let response = await fetch(apiUrl + "/dashboard/partido-semana", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setPartidoSemana(data.datos);
      }
    }

    async function getClasificacion() {
      let response = await fetch(apiUrl + "/dashboard/clasificacion", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setClasificacion(data.datos);
      }
    }

    getTotalJugadoras();
    getTotalPartidosFinalizados();
    getTotalPuntos();
    getProximoEntrenamiento();
    getPartidoSemana();
    getClasificacion();
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
            gap: "16px",
          }}
        >
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total de Jugadoras: {totalJugadoras}
            </Typography>
          </Box>
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total de partidos finalizados: {totalPartidosJugados}
            </Typography>
          </Box>
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total de puntos: {totalPuntos.puntos}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Proximo entrenamiento
          </Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <Typography variant="body1" gutterBottom>
              Tipo: {proximoEntrenamiento.tipo}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Fecha: {proximoEntrenamiento.fecha_entrenamiento}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Hora inicio: {proximoEntrenamiento.hora_inicio}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Hora final: {proximoEntrenamiento.hora_final}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Informacion: {proximoEntrenamiento.informacion}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Partido de la semana
          </Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <img
              src={`http://localhost:3000/uploads/${partidoSemana?.idrival_club?.imagen}`}
              style={{
                height: "100px",
                width: "100px",
                margin: "1rem",
              }}
            />
            <Typography variant="body1" gutterBottom>
              {partidoSemana.idrival_club?.nombre}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Ubicacion: {partidoSemana?.ubicacion}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Fecha partido: {partidoSemana?.fecha_partido}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Hora: {partidoSemana?.hora}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Clasificacion
          </Typography>
          {clasificacion.map((club) => (
            <Grid item xs={12} md={6} lg={4} key={club.idclub}>
              <Paper
                elevation={3}
                sx={{ p: 3, display: "flex", alignItems: "center" }}
              >
                <img
                  src={`http://localhost:3000/uploads/${club?.imagen}`}
                  style={{
                    height: "70px",
                    width: "70px",
                    margin: "1rem",
                  }}
                />
                <Box>
                  <Typography variant="h6">{club.nombre}</Typography>
                  <Typography variant="body1">Ciudad: {club.ciudad}</Typography>
                  <Typography variant="body1">
                    Estadio: {club.estadio}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Puntos: <strong>{club.puntos}</strong>
                  </Typography>
                  <Typography variant="caption">
                    Fundado:{" "}
                    {new Date(club.fecha_fundacion).toLocaleDateString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
