import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  ImageListItem,
  Modal,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { PiMapPinSimpleAreaBold } from "react-icons/pi";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import CancelIcon from "@mui/icons-material/Cancel";
import { playNotificationSound } from "../../utils/Funciones";
import { enqueueSnackbar } from "notistack";
import PlaceIcon from "@mui/icons-material/Place";

function ShowTraining() {
  const { identrenamiento } = useParams();
  const [datosEntrenamiento, setDatosEntrenamiento] = useState([]);
  const [datosAsistencia, setDatosAsistencia] = useState([]);
  const [datosNoAsistencia, setDatosNoAsistencia] = useState([]);
  const navigate = useNavigate();
  const notificacion = useRef(null);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const fechaFormateada = format(fecha, "MMM d, yyyy", {
      locale: es,
    }).replace(/^\w/, (c) => c.toUpperCase());

    return fechaFormateada;
  };

  useEffect(() => {
    async function getAllInformacionByIdEntrenamiento() {
      let responseEntrenamiento = await fetch(
        apiUrl + "/entrenamientos/" + identrenamiento,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (responseEntrenamiento.ok) {
        let data = await responseEntrenamiento.json();
        setDatosEntrenamiento(data.datos);
      }

      let responseAsistencias = await fetch(
        apiUrl + "/entrenamientos/tipo/" + identrenamiento,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (responseAsistencias.ok) {
        let data = await responseAsistencias.json();
        setDatosAsistencia(data.datos);
      }

      let responseNoAsistencias = await fetch(
        apiUrl + "/entrenamientos/tipo/no-asistidos/" + identrenamiento,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (responseNoAsistencias.ok) {
        let data = await responseNoAsistencias.json();
        setDatosNoAsistencia(data.datos);
      }
    }

    getAllInformacionByIdEntrenamiento();
  }, []);

  const handleDelete = async (idasistencia, tipo) => {
    let response = await fetch(
      apiUrl + "/entrenamientos/tipo/" + idasistencia,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      // Establece los datos de nuevo para provocar un renderizado
      if (tipo === "asistencia") {
        const asistenciaTrasBorrado = datosAsistencia.filter(
          (asistencia) => asistencia.idasistencia != idasistencia
        );
        setDatosAsistencia(asistenciaTrasBorrado);
      } else if (tipo === "noAsistencia") {
        const asistenciaTrasBorrado = datosNoAsistencia.filter(
          (asistencia) => asistencia.idasistencia != idasistencia
        );
        setDatosNoAsistencia(asistenciaTrasBorrado);
      }

      playNotificationSound(notificacion);

      enqueueSnackbar("Guardado con éxito", {
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonthIcon
              sx={{
                color: "#00338e",
                fontSize: "26px",
                margin: "0px",
                padding: "0px",
              }}
            ></CalendarMonthIcon>
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
              {formatearFecha(datosEntrenamiento.fecha_entrenamiento)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Link to={`/home/crear-confirmacion/${identrenamiento}/${true}`}>
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
                variant="contained"
              >
                <Tooltip title="Crear asistencia">
                  <FaUserPlus style={{ fontSize: "24px" }}></FaUserPlus>
                </Tooltip>
              </Button>
            </Link>

            <Link to={`/home/crear-confirmacion/${identrenamiento}/${false}`}>
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
                variant="contained"
              >
                <Tooltip title="Crear no asistencia">
                  <FaUserTimes style={{ fontSize: "24px" }}></FaUserTimes>
                </Tooltip>
              </Button>
            </Link>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              minWidth: "50%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "white",
              border: "1px solid #BDBDBD",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Typography
              sx={{
                color: "#3d64a8",
                fontFamily: "'Open sans'",
                fontWeight: 600,
              }}
            >
              Asistencia confirmadas
            </Typography>
            {datosAsistencia.map((asistencia) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #BDBDBD",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <img
                    src={`http://localhost:3000/uploads/${asistencia.idjugadora_jugadora.imagen}`}
                    style={{
                      borderRadius: "70%",
                      height: "60px",
                      width: "60px",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                      objectFit: "cover",
                    }}
                  ></img>
                  <Box sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#3d64a8",
                        marginBottom: "0.3rem",
                        marginLeft: "0.4rem"
                      }}
                    >
                      <Typography variant="body1">
                        {asistencia.idjugadora_jugadora.nombre}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#3d64a8",
                      }}
                    >
                      <PlaceIcon></PlaceIcon>
                      <Typography variant="body1">
                        {asistencia.idjugadora_jugadora.posicion}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box
                    onClick={() =>
                      handleDelete(asistencia.idasistencia, "asistencia")
                    }
                    sx={{ cursor: "pointer", alignSelf: "flex-end" }}
                  >
                    <Tooltip title="Eliminar confirmación">
                      <CancelIcon
                        sx={{
                          color: "#3d64a8",
                          fontSize: { xs: "24px", md: "24px" },
                        }}
                      ></CancelIcon>
                    </Tooltip>
                  </Box>
                </Box>
              </div>
            ))}
          </Box>
          <Box
            sx={{
              minWidth: "50%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "white",
              border: "1px solid #BDBDBD",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Typography
              sx={{
                color: "#3d64a8",
                fontFamily: "'Open sans'",
                fontWeight: 600,
              }}
            >
              Asistencia rechazadas
            </Typography>
            {datosNoAsistencia.map((asistencia) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #BDBDBD",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <img
                    src={`http://localhost:3000/uploads/${asistencia.idjugadora_jugadora.imagen}`}
                    style={{
                      borderRadius: "70%",
                      height: "60px",
                      width: "60px",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                      objectFit: "cover",
                    }}
                  ></img>
                  <Box sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "0.4rem",
                        alignItems: "center",
                        color: "#3d64a8",
                        marginBottom: "0.3rem",
                        marginLeft: "0.4rem"
                      }}
                    >
                      <Typography variant="body1">
                        {asistencia.idjugadora_jugadora.nombre}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#3d64a8",
                      }}
                    >
                      <PlaceIcon></PlaceIcon>
                      <Typography variant="body1">
                        {asistencia.idjugadora_jugadora.posicion}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box
                    onClick={() =>
                      handleDelete(asistencia.idasistencia, "noAsistencia")
                    }
                    sx={{ cursor: "pointer", alignSelf: "flex-end" }}
                  >
                    <Tooltip title="Eliminar confirmación">
                      <CancelIcon
                        sx={{
                          color: "#3d64a8",
                          fontSize: { xs: "24px", md: "24px" },
                        }}
                      ></CancelIcon>
                    </Tooltip>
                  </Box>
                </Box>
              </div>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ShowTraining;
