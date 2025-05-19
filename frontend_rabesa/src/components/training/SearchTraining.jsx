import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../config";
import useUserStore from "../../stores/useUserStore";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import { playNotificationSound } from "../../utils/Funciones";
import { enqueueSnackbar } from "notistack";

function SearchTraining() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fechadesde: new Date(),
    fechahasta: new Date(),
  });
  const [datosEntrenamientos, setDatosEntrenamientos] = useState([]);
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

  const { user } = useUserStore();
  let entrenador = false;

  if (user.rol == "Entrenador") {
    entrenador = true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        apiUrl +
          "/entrenamientos/buscar/" +
          formData.fechadesde +
          "/" +
          formData.fechahasta +
          "/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      let data = await response.json();
      if (response.ok) {
        setDatosEntrenamientos(data.datos);
      } else {
        playNotificationSound(notificacionError);

        enqueueSnackbar(data.mensaje, {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      }
    } catch (error) {
      playNotificationSound(notificacionError);

      enqueueSnackbar("Error de red. Inténtalo de nuevo más tarde.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
            <SearchIcon sx={{ fontSize: "26px" }}></SearchIcon> Buscar
            entrenamiento
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
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #BDBDBD",
            backgroundColor: "white",
            borderRadius: "4px",
            padding: "20px",
            width: "100%",
            gap: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Fecha desde
              </Typography>
              <TextField
                name="fechadesde"
                value={formData.fechadesde}
                type="date"
                onChange={handleChange}
                sx={{ width: "100%" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon
                        sx={{ color: "#a6a6a6", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Fecha hasta
              </Typography>
              <TextField
                name="fechahasta"
                value={formData.fechahasta}
                type="date"
                onChange={handleChange}
                sx={{ width: "100%" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon
                        sx={{ color: "#a6a6a6", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

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
              width: "12rem",
            }}
            type="submit"
          >
            Buscar
          </Button>
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
          {datosEntrenamientos.map((entrenamiento) => (
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
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.3,
                      alignSelf: { xs: "flex-start" },
                    }}
                  >
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
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default SearchTraining;
