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
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../config";
import useUserStore from "../../stores/useUserStore";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import TimerIcon from "@mui/icons-material/Timer";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SearchIcon from "@mui/icons-material/Search";
import { SnackbarProvider, useSnackbar } from "notistack";
import { playNotificationSound } from "../../utils/Funciones";

function Training() {
  const [datosEntrenamientos, setDatosEntrenamientos] = useState([]);
  const [datosJugadora, setDatosJugadora] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
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

  const { user } = useUserStore();
  let entrenador = false;

  if (user.rol == "Entrenador") {
    entrenador = true;
  }

  useEffect(() => {
    async function getEntrenamientosEntrenador() {
      let response = await fetch(apiUrl + "/entrenamientos/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setDatosEntrenamientos(data.datos);
      }
    }

    async function getDatosJugadora() {
      if (entrenador) {
        await getEntrenamientosEntrenador();
      } else {
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

          const entrenamientosResponse = await fetch(
            apiUrl +
              "/entrenamientos/tipo/noconfirmados/" +
              jugadoraData.datos.idjugadora,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (entrenamientosResponse.ok) {
            const entrenamientosData = await entrenamientosResponse.json();
            setDatosEntrenamientos(entrenamientosData.datos);
          }
        }
      }
    }

    getDatosJugadora();
  }, []);

  const handleSubmitAsistencia = async (
    identrenamiento,
    idjugadora,
    estado
  ) => {
    console.log(identrenamiento);
    console.log(idjugadora);
    console.log(estado);

    try {
      const response = await fetch(
        apiUrl +
          "/entrenamientos/tipo/" +
          identrenamiento +
          "/" +
          idjugadora +
          "/" +
          estado,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Actualiza el estado local filtrando el entrenamiento confirmado
        setDatosEntrenamientos((prev) =>
          prev.filter((ent) => ent.identrenamiento !== identrenamiento)
        );

        playNotificationSound(notificacion);

        enqueueSnackbar(data.mensaje, {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      } else {
        playNotificationSound(notificacion);

        enqueueSnackbar(data.mensaje, {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      }
    } catch (error) {
      playNotificationSound(notificacion);

      enqueueSnackbar("Error de red. Inténtalo de nuevo más tarde.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  const handleDelete = async (identrenamiento) => {
    let response = await fetch(apiUrl + "/entrenamientos/" + identrenamiento, {
      method: "DELETE",
    });

    if (response.ok) {
      const entrenamientoTrasBorrado = datosEntrenamientos.filter(
        (entrenamiento) => entrenamiento.identrenamiento != identrenamiento
      );

      // Establece los datos de nuevo para provocar un renderizado
      setDatosEntrenamientos(entrenamientoTrasBorrado);

      playNotificationSound(notificacion);

      enqueueSnackbar("Entrenamiento borrado correctamente", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <>
      <audio ref={notificacion} src="/sonido/notificacion.mp3" preload="auto" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TimerIcon
              sx={{
                color: "#00338e",
                fontSize: "26px",
                margin: "0px",
                padding: "0px",
              }}
            ></TimerIcon>
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
              Entrenamientos
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {entrenador ? (
              <Link to="/home/crear-entrenamiento">
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
                  <Tooltip title="Crear entrenamiento">
                    <InsertInvitationIcon></InsertInvitationIcon>
                  </Tooltip>
                </Button>
              </Link>
            ) : (
              <Link to="/home/training/asistidos">
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
                  <Tooltip title="Entrenamientos confirmados">
                    <EventAvailableIcon></EventAvailableIcon>
                  </Tooltip>
                </Button>
              </Link>
            )}
            {entrenador ? null : (
              <Link to="/home/training/no-asistidos">
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
                  <Tooltip title="Entrenamientos rechazados">
                    <EventBusyIcon></EventBusyIcon>
                  </Tooltip>
                </Button>
              </Link>
            )}
            {entrenador ? (
              <Link to="/home/buscar-entrenamientos">
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
                  <Tooltip title="Buscar entrenamientos">
                    <SearchIcon></SearchIcon>
                  </Tooltip>
                </Button>
              </Link>
            ) : null}
          </Box>
        </div>
        
        <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {datosEntrenamientos.length === 0 ? (
            <Box
              sx={{
                border: "1px solid #BDBDBD",
                padding: "16px",
                borderRadius: "4px",
                textAlign: "center",
                backgroundColor: "white",
              }}
            >
              <Typography
                variant="body"
                sx={{
                  alignSelf: { xs: "flex-start" },
                }}
              >
                No hay entrenamientos programados
              </Typography>
            </Box>
          ) : (
            <>
              {datosEntrenamientos.map((entrenamiento) => (
                <Box
                  sx={{
                    display: "flex",
                    border: "1px solid #BDBDBD",
                    padding: "16px",
                    borderRadius: "4px",
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
                      {new Date(
                        entrenamiento.fecha_entrenamiento
                      ).toLocaleString("es-ES", { day: "numeric" })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "uppercase", lineHeight: 1 }}
                    >
                      {new Date(
                        entrenamiento.fecha_entrenamiento
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
                          {entrenamiento.tipo}
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
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

                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
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
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.3,
                          alignSelf: { xs: "flex-start" },
                        }}
                      >
                        {entrenador ? (
                          <Link
                            to={`/home/training/mostrar-entrenamiento/${entrenamiento.identrenamiento}`}
                          >
                            <Tooltip title="Informacion del entrenamiento">
                              <EventNoteIcon
                                sx={{
                                  color: "#00338e",
                                  fontSize: { xs: "24px", md: "28px" },
                                  marginTop: "1px",
                                }}
                              ></EventNoteIcon>
                            </Tooltip>
                          </Link>
                        ) : null}
                        {entrenador ? (
                          <Link
                            to={`/home/modificar-entrenamiento/${entrenamiento.identrenamiento}`}
                          >
                            <Tooltip title="Modificar entrenamiento">
                              <EditCalendarIcon
                                sx={{
                                  color: "#00338e",
                                  fontSize: { xs: "24px", md: "28px" },
                                }}
                              ></EditCalendarIcon>
                            </Tooltip>
                          </Link>
                        ) : (
                          <Box
                            onClick={() =>
                              handleSubmitAsistencia(
                                entrenamiento.identrenamiento,
                                datosJugadora.idjugadora,
                                true
                              )
                            }
                            sx={{ cursor: "pointer" }}
                          >
                            <Tooltip title="Asistir">
                              <CheckCircleIcon
                                sx={{
                                  color: "#00338e",
                                  fontSize: { xs: "24px", md: "28px" },
                                }}
                              ></CheckCircleIcon>
                            </Tooltip>
                          </Box>
                        )}
                        {entrenador ? (
                          <Box
                            onClick={() =>
                              handleDelete(entrenamiento.identrenamiento)
                            }
                            sx={{ cursor: "pointer" }}
                          >
                            <Tooltip title="Eliminar entrenamiento">
                              <DeleteIcon
                                sx={{
                                  color: "#00338e",
                                  fontSize: { xs: "24px", md: "28px" },
                                }}
                              ></DeleteIcon>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Box
                            onClick={() =>
                              handleSubmitAsistencia(
                                entrenamiento.identrenamiento,
                                datosJugadora.idjugadora,
                                false
                              )
                            }
                            sx={{ cursor: "pointer" }}
                          >
                            <Tooltip title="No asistir">
                              <CancelIcon
                                sx={{
                                  color: "#00338e",
                                  fontSize: { xs: "24px", md: "28px" },
                                }}
                              ></CancelIcon>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Training;
