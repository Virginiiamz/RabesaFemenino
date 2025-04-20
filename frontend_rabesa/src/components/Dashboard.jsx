import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import ShieldIcon from "@mui/icons-material/Shield";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TimerIcon from "@mui/icons-material/Timer";
import logoRabesa from "../assets/img/logo_rabesa.jpg";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

function Dashboard() {
  const [totalJugadoras, setTotalJugadoras] = useState([]);
  const [totalPartidosJugados, setTotalPartidosJugados] = useState([]);
  const [totalPuntos, setTotalPuntos] = useState([]);
  const [proximoEntrenamiento, setProximoEntrenamiento] = useState([]);
  const [partidoSemana, setPartidoSemana] = useState(null);
  const [clasificacion, setClasificacion] = useState([]);

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

  const formatHora = (horaString) => {
    // Verifica si la hora existe y es un string
    if (!horaString || typeof horaString !== "string") return "--:--"; // Valor por defecto

    try {
      const [hora, minuto] = horaString.split(":");
      return `${hora}:${minuto}`; // Formato 24h (ejemplo: "12:00")
    } catch (error) {
      console.error("Error al formatear la hora:", error);
      return "--:--"; // Fallback seguro
    }
  };

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
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            marginBottom: "30px",
            gap: "16px",
          }}
        >
          <Box
            sx={{
              border: "1px solid #BDBDBD",
              paddingX: "16px",
              paddingTop: "16px",
              borderRadius: "8px",
              width: "100%",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontFamily: "'Open sans'",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#00338e",
                }}
              >
                Total Jugadoras
              </Typography>
              <ShieldIcon
                sx={{ color: "#00338e", fontSize: "20px" }}
              ></ShieldIcon>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                paddingTop: "1rem",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontFamily: "'Open sans'",
                  fontSize: "40px",
                  fontWeight: 600,
                  color: "#00338e",
                }}
              >
                {totalJugadoras}
              </Typography>
            </div>
          </Box>
          <Box
            sx={{
              border: "1px solid #BDBDBD",
              paddingX: "16px",
              paddingTop: "16px",
              borderRadius: "8px",
              width: "100%",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontFamily: "'Open sans'",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#00338e",
                }}
              >
                Partidos Finalizados
              </Typography>
              <SportsSoccerIcon
                sx={{ color: "#00338e", fontSize: "20px" }}
              ></SportsSoccerIcon>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                paddingTop: "1rem",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontFamily: "'Open sans'",
                  fontSize: "40px",
                  fontWeight: 600,
                  color: "#00338e",
                }}
              >
                {totalPartidosJugados}
              </Typography>
            </div>
          </Box>
          <Box
            sx={{
              border: "1px solid #BDBDBD",
              paddingX: "16px",
              paddingTop: "16px",
              borderRadius: "8px",
              width: "100%",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontFamily: "'Open sans'",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#00338e",
                }}
              >
                Total Puntos
              </Typography>
              <EmojiEventsIcon
                sx={{ color: "#00338e", fontSize: "20px" }}
              ></EmojiEventsIcon>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                paddingTop: "1rem",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontFamily: "'Open sans'",
                  fontSize: "40px",
                  fontWeight: 600,
                  color: "#00338e",
                }}
              >
                {totalPuntos.puntos}
              </Typography>
            </div>
          </Box>
        </Box>
        <Box sx={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <TimerIcon
              sx={{
                color: "#00338e",
                fontSize: "22px",
                margin: "0px",
                padding: "0px",
              }}
            ></TimerIcon>
            <Typography
              sx={{
                fontFamily: "'Open sans'",
                fontSize: "19px",
                fontWeight: 600,
                color: "#00338e",
                padding: "0px",
              }}
            >
              Próximo entrenamiento
            </Typography>
          </div>

          {proximoEntrenamiento.length !== 0 ? (
            <Box
              sx={{
                display: "flex",
                border: "1px solid #BDBDBD",
                padding: "16px",
                borderRadius: "8px",
                width: "100%",
                backgroundColor: "#FFFFFF",
                gap: 3,
              }}
            >
              {/* Calendario */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  backgroundColor: "#3d64a8",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", lineHeight: 1 }}
                >
                  {new Date(
                    proximoEntrenamiento.fecha_entrenamiento
                  ).toLocaleString("es-ES", { day: "numeric" })}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textTransform: "uppercase", lineHeight: 1 }}
                >
                  {new Date(
                    proximoEntrenamiento.fecha_entrenamiento
                  ).toLocaleString("es-ES", { month: "short" })}
                </Typography>
              </Box>

              {/* Información del entrenamiento */}
              <Box sx={{ flexGrow: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.7rem",
                  }}
                >
                  <FitnessCenterIcon sx={{ mr: 1.5, color: "#3d64a8" }} />
                  <Box>
                    <Typography
                      sx={{
                        color: "#3d64a8",
                        fontFamily: "'Open sans'",
                        fontWeight: 600,
                      }}
                    >
                      Tipo
                    </Typography>
                    <Typography variant="body1">
                      {proximoEntrenamiento.tipo}
                    </Typography>
                  </Box>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.7rem",
                  }}
                >
                  <CalendarTodayIcon sx={{ mr: 1.5, color: "#3d64a8" }} />
                  <Box>
                    <Typography
                      sx={{
                        color: "#3d64a8",
                        fontFamily: "'Open sans'",
                        fontWeight: 600,
                      }}
                    >
                      Fecha
                    </Typography>
                    <Typography variant="body1">
                      {formatearFecha(proximoEntrenamiento.fecha_entrenamiento)}
                    </Typography>
                  </Box>
                </div>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 1, md: 3 },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1.5, color: "#3d64a8" }} />
                    <Box>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                      >
                        Inicio
                      </Typography>
                      <Typography variant="body1">
                        {formatHora(proximoEntrenamiento?.hora_inicio)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1.5, color: "#3d64a8" }} />
                    <Box>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                      >
                        Fin
                      </Typography>
                      <Typography variant="body1">
                        {formatHora(proximoEntrenamiento?.hora_final)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />

                <Typography
                  variant="subtitle2"
                  sx={{ color: "#3d64a8", mb: 1 }}
                >
                  Información adicional
                </Typography>

                {proximoEntrenamiento.informacion ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.7rem",
                    }}
                  >
                    <Typography variant="body1" gutterBottom>
                      {proximoEntrenamiento.informacion}
                    </Typography>
                  </div>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", marginBottom: "0.7rem" }}
                  >
                    [No hay ninguna información adicional]
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                border: "1px solid #BDBDBD",
                paddingX: "16px",
                paddingTop: "16px",
                borderRadius: "8px",
                width: "100%",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Typography sx={{ fontStyle: "italic", marginBottom: "0.7rem" }}>
                [No hay ningun entrenamiento programado]
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <SportsSoccerIcon
              sx={{
                color: "#00338e",
                fontSize: "22px",
                margin: "0px",
                padding: "0px",
              }}
            ></SportsSoccerIcon>
            <Typography
              sx={{
                fontFamily: "'Open sans'",
                fontSize: "19px",
                fontWeight: 600,
                color: "#00338e",
                padding: "0px",
              }}
            >
              Partido de la semana
            </Typography>
          </div>
          {partidoSemana ? (
            <Box
              sx={{
                border: "1px solid #BDBDBD",
                paddingX: "16px",
                paddingY: "16px",
                borderRadius: "8px",
                width: "100%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.4rem",
                  margin: "1rem",
                  padding: "0.8rem",
                }}
              >
                <Box
                  component="img"
                  src={logoRabesa}
                  sx={{
                    height: { xs: "60px", lg: "90px" },
                    width: { xs: "50px", lg: "80px" },
                  }}
                  alt="Escudo Rabesa"
                />
                <Typography
                  sx={{
                    fontSize: { xs: "16px", lg: "20px" },
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                  }}
                  gutterBottom
                >
                  Rabesa
                </Typography>
              </Box>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  margin: "1rem",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "12px", lg: "16px" },
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                  }}
                  gutterBottom
                >
                  {formatearFecha(partidoSemana.fecha_partido)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", lg: "16px" },
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                  }}
                  gutterBottom
                >
                  {formatHora(partidoSemana?.hora)} H
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", lg: "16px" },
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                  }}
                  gutterBottom
                >
                  {partidoSemana.ubicacion}
                </Typography>
              </div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.4rem",
                  margin: "1rem",
                }}
              >
                <Box
                  component="img"
                  src={`http://localhost:3000/uploads/${partidoSemana.idrival_club?.imagen}`}
                  sx={{
                    height: { xs: "50px", lg: "90px" },
                    width: { xs: "50px", lg: "90px" },
                  }}
                  alt="Escudo del rival"
                />
                <Typography
                  sx={{
                    fontSize: { xs: "16px", lg: "20px" },
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                  gutterBottom
                >
                  {partidoSemana.idrival_club?.nombre}
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  border: "1px solid #BDBDBD",
                  paddingX: "16px",
                  paddingTop: "16px",
                  borderRadius: "8px",
                  width: "100%",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Typography
                  sx={{ fontStyle: "italic", marginBottom: "0.7rem" }}
                >
                  [No hay ningun partido programado]
                </Typography>
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <FormatListNumberedIcon
              sx={{
                color: "#00338e",
                fontSize: "22px",
                margin: "0px",
                padding: "0px",
              }}
            ></FormatListNumberedIcon>
            <Typography
              sx={{
                fontFamily: "'Open sans'",
                fontSize: "19px",
                fontWeight: 600,
                color: "#00338e",
                padding: "0px",
              }}
            >
              Clasificación
            </Typography>
          </div>
          {clasificacion.map((club) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={club.idclub}
              sx={{ marginY: "1rem" }}
            >
              <Paper
                elevation={3}
                sx={{ p: 3, display: "flex", alignItems: "center" }}
              >
                <Box
                  component={"img"}
                  src={`http://localhost:3000/uploads/${club?.imagen}`}
                  sx={{
                    height: { xs: "50px", lg: "80px" },
                    width: { xs: "50px", lg: "80px" },
                    objectFit: "cover",
                    margin: "1rem",
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "16px", lg: "20px" },
                      fontFamily: "Open Sans",
                      fontWeight: 600,
                    }}
                    gutterBottom
                  >
                    {club.nombre}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", lg: "16px" },
                      fontFamily: "Open Sans",
                    }}
                    gutterBottom
                  >
                    Ciudad: {club.ciudad}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", lg: "16px" },
                      fontFamily: "Open Sans",
                    }}
                    gutterBottom
                  >
                    Estadio: {club.estadio}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", lg: "16px" },
                      fontFamily: "Open Sans",
                    }}
                    gutterBottom
                  >
                    Puntos: {club.puntos}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", lg: "16px" },
                      fontFamily: "Open Sans",
                    }}
                    gutterBottom
                  >
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
