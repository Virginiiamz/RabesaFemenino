import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
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

        <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />

        {datosAsistencia.length == 0 && datosNoAsistencia.length == 0 ? (
          <Box
            sx={{
              border: "1px solid #BDBDBD",
              paddingTop: "16px",
              borderRadius: "4px",
              width: "100%",
              backgroundColor: "#FFFFFF",
              margin: "0px",
            }}
          >
            <Typography sx={{ marginBottom: "0.7rem", textAlign: "center" }}>
              No hay ninguna confirmación en este entrenamiento
            </Typography>
          </Box>
        ) : null}

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
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            {datosAsistencia.length != 0 ? (
              <Typography
                sx={{
                  color: "#3d64a8",
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                }}
              >
                Asistencia confirmadas
              </Typography>
            ) : null}
            {datosAsistencia.map((asistencia) => (
              <Card
                sx={{
                  border: "1px solid #BDBDBD",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "none",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <CardMedia
                        component="img"
                        sx={{
                          borderRadius: "100%",
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                        alt={asistencia.idjugadora_jugadora.nombre}
                        image={asistencia.idjugadora_jugadora.imagen}
                      />
                      <Box sx={{}}>
                        <Typography
                          sx={{
                            color: "#3d64a8",
                            fontFamily: "'Open sans'",
                            fontWeight: 600,
                          }}
                        >
                          {asistencia.idjugadora_jugadora.nombre}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {asistencia.idjugadora_jugadora.posicion}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <>
                        <Box
                          onClick={() =>
                            handleDelete(asistencia.idasistencia, "asistencia")
                          }
                          sx={{ cursor: "pointer" }}
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
                      </>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      margin: 1,
                      display: "flex",
                      gap: 4,
                      alignItems: "start",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                        variant="subtitle2"
                      >
                        Edad
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {asistencia.idjugadora_jugadora.edad}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                        variant="subtitle2"
                      >
                        Dorsal
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {asistencia.idjugadora_jugadora.numero_camiseta}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                        variant="subtitle2"
                      >
                        Estado
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {asistencia.idjugadora_jugadora.estado}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box
            sx={{
              minWidth: "50%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            {datosNoAsistencia.length != 0 ? (
              <Typography
                sx={{
                  color: "#3d64a8",
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                }}
              >
                Asistencia rechazadas
              </Typography>
            ) : null}
            {datosNoAsistencia.map((asistencia) => (
              <Card
                sx={{
                  border: "1px solid #BDBDBD",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "none",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <CardMedia
                        component="img"
                        sx={{
                          borderRadius: "100%",
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                        alt={asistencia.idjugadora_jugadora.nombre}
                        image={asistencia.idjugadora_jugadora.imagen}
                      />
                      <Box sx={{}}>
                        <Typography
                          sx={{
                            color: "#3d64a8",
                            fontFamily: "'Open sans'",
                            fontWeight: 600,
                          }}
                        >
                          {asistencia.idjugadora_jugadora.nombre}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {asistencia.idjugadora_jugadora.posicion}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <>
                        <Box
                          onClick={() =>
                            handleDelete(
                              asistencia.idasistencia,
                              "noAsistencia"
                            )
                          }
                          sx={{ cursor: "pointer" }}
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
                      </>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      margin: 1,
                      display: "flex",
                      gap: 4,
                      alignItems: "start",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                        variant="subtitle2"
                      >
                        Edad
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {asistencia.idjugadora_jugadora.edad}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                        variant="subtitle2"
                      >
                        Dorsal
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {asistencia.idjugadora_jugadora.numero_camiseta}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                        variant="subtitle2"
                      >
                        Estado
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {asistencia.idjugadora_jugadora.estado}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ShowTraining;
