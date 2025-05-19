import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { playNotificationSound } from "../../utils/Funciones";
import { enqueueSnackbar } from "notistack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaceIcon from "@mui/icons-material/Place";

function CreateVerification() {
  const { identrenamiento, tipoconfirmacion } = useParams();
  const [datosJugadoras, setDatosJugadoras] = useState([]);
  const [formData, setFormData] = useState({
    identrenamiento: identrenamiento,
    idjugadora: null,
    estado: tipoconfirmacion === "true",
  });
  const navigate = useNavigate();
  const notificacionError = useRef(null);
  const notificacion = useRef(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      estado: tipoconfirmacion === "true",
    }));

    async function getAllJugadoraNoConfirmadasByEntrenamiento() {
      let response = await fetch(
        apiUrl +
          "/entrenamientos/tipo/jugadoras/noconfirmadas/" +
          identrenamiento,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        let data = await response.json();
        setDatosJugadoras(data.datos);
      }
    }

    getAllJugadoraNoConfirmadasByEntrenamiento();
  }, []);

  const handleSubmit = async (idjugadora) => {
    // e.preventDefault();
    let { identrenamiento, estado } = formData;

    if (tipoconfirmacion == true) {
      estado = true;
    }

    if (!idjugadora) {
      playNotificationSound(notificacionError);

      enqueueSnackbar("Tienes que seleccionar una jugadora", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/entrenamientos/tipo/${identrenamiento}/${idjugadora}/${estado}`,
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
        playNotificationSound(notificacion);

        enqueueSnackbar(data.mensaje, {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        setTimeout(() => {
          navigate(0);
        }, 1000);
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

    // Asegúrate de convertir el valor a número si es necesario
    setFormData((prev) => ({
      ...prev,
      [name]: name === "idjugadora" ? Number(value) : value,
    }));
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
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {formData.estado ? (
              <>
                <FaUserPlus
                  style={{
                    color: "#00338e",
                    fontSize: "24px",
                    margin: "0px",
                    padding: "0px",
                  }}
                ></FaUserPlus>
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
                  Crear asistencia
                </Typography>
              </>
            ) : (
              <>
                <FaUserTimes
                  style={{
                    color: "#00338e",
                    fontSize: "24px",
                    margin: "0px",
                    padding: "0px",
                  }}
                ></FaUserTimes>
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
                  Crear no asistencia
                </Typography>
              </>
            )}
          </Box>
          <Link to={`/home/training/mostrar-entrenamiento/${identrenamiento}`}>
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


        <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
            justifyContent: "center",
            width: "100%",
            marginY: 2,
          }}
        >
          {datosJugadoras.map((jugadora) => (
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
                      alt={jugadora.nombre}
                      image={jugadora.imagen}
                    />
                    <Box sx={{}}>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                      >
                        {jugadora.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {jugadora.posicion}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <>
                      <Box
                        onClick={() => handleSubmit(jugadora.idjugadora)}
                        sx={{ cursor: "pointer" }}
                      >
                        <Tooltip title="Confirmar asistencia">
                          <CheckCircleIcon
                            sx={{
                              color: "#3d64a8",
                              fontSize: { xs: "24px", md: "24px" },
                            }}
                          ></CheckCircleIcon>
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
                      {jugadora.edad}
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
                      {jugadora.numero_camiseta}
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
                      {jugadora.estado}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default CreateVerification;
