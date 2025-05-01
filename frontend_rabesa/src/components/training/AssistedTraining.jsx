import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../../config";
import { Link, useNavigate } from "react-router";
import useUserStore from "../../stores/useUserStore";
import { FaUserPlus } from "react-icons/fa";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import { playNotificationSound } from "../../utils/Funciones";
import { enqueueSnackbar } from "notistack";

function AssistedTraining() {
  const [datosConfirmados, setDatosConfirmados] = useState([]);
  const [datosJugadora, setDatosJugadora] = useState([]);
  const navigate = useNavigate();

  const { user } = useUserStore();

  const notificacionError = useRef(null);
  const notificacion = useRef(null);

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
            "/entrenamientos/tipo/asistidos/jugadora/" +
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
    try {
      let response = await fetch(
        `${apiUrl}/entrenamientos/tipo/${idasistencia}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Actualizar el estado basado en el estado anterior
        setDatosConfirmados((prev) =>
          prev.filter((entrenamiento) => {
            // Verifica si asistencia_entrenamientos existe y tiene elementos
            if (
              !entrenamiento.asistencia_entrenamientos ||
              entrenamiento.asistencia_entrenamientos.length === 0
            ) {
              return true; // Mantener este entrenamiento si no tiene asistencia
            }

            // Comparar con el idasistencia correcto
            return (
              entrenamiento.asistencia_entrenamientos[0].idasistencia !=
              idasistencia
            );
          })
        );

        playNotificationSound(notificacion);

        enqueueSnackbar("Asistencia cancelada con éxito", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      } else {
        throw new Error("Error al eliminar");
      }
    } catch (error) {
      enqueueSnackbar("Error al cancelar la asistencia", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      console.error("Error en handleDelete:", error);
    }
  };

  return (
    <>
      <audio
        ref={notificacionError}
        src="/sonido/notificacion_error.mp3"
        preload="auto"
      />
      <audio ref={notificacion} src="/sonido/notificacion.mp3" preload="auto" />

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
            marginBottom: "10px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Open sans'",
              fontSize: "22px",
              fontWeight: 600,
              color: "#00338e",
              padding: "0px",
              margin: "0px",
            }}
          >
            <EventAvailableIcon sx={{ fontSize: "26px" }}></EventAvailableIcon>{" "}
            Entrenamientos confirmados
          </Typography>
          <Link to="/home/training">
            <Button
              sx={{
                gap: 0.5,
                color: "white",
                backgroundColor: "#00338e",
                fontFamily: "'Open sans'",
                fontSize: "14px",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#AACBFF",
                  color: "#00338e",
                },
              }}
            >
              <Tooltip title="Volver atrás">
                <ArrowBackIcon></ArrowBackIcon>
              </Tooltip>
            </Button>
          </Link>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: "1rem",
          }}
        >
          {datosConfirmados.map((entrenamiento) => (
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
              key={entrenamiento.identrenamiento}
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
                  {new Date(entrenamiento.fecha_entrenamiento).toLocaleString(
                    "es-ES",
                    { day: "numeric" }
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textTransform: "uppercase", lineHeight: 1 }}
                >
                  {new Date(entrenamiento.fecha_entrenamiento).toLocaleString(
                    "es-ES",
                    { month: "short" }
                  )}
                </Typography>
              </Box>

              {/* Información del entrenamiento */}
              <Box sx={{ flexGrow: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.7rem",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
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
                        {entrenamiento.tipo}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    onClick={() =>
                      handleDelete(
                        entrenamiento.asistencia_entrenamientos[0].idasistencia
                      )
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Cancelar asistencia">
                      <CloseIcon
                        sx={{
                          color: "#00338e",
                          fontSize: { xs: "24px", md: "28px" },
                        }}
                      ></CloseIcon>
                    </Tooltip>
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
                      {formatearFecha(entrenamiento.fecha_entrenamiento)}
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
                        {formatHora(entrenamiento?.hora_inicio)}
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
                        {formatHora(entrenamiento?.hora_final)}
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

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {entrenamiento.informacion ? (
                    <Typography
                      variant="body2"
                      sx={{
                        marginBottom: "0.7rem",
                        alignSelf: { xs: "flex-start" },
                      }}
                    >
                      {entrenamiento.informacion}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        marginBottom: "0.7rem",
                        alignSelf: { xs: "flex-start" },
                      }}
                    >
                      [No hay ninguna información adicional]
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

{
  /* <Card>
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
            </Card> */
}

export default AssistedTraining;
