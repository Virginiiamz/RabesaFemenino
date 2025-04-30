import {
  Box,
  Button,
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
import { apiUrl } from "../config";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { playNotificationSound } from "../utils/Funciones";
import { enqueueSnackbar } from "notistack";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { idjugadora, identrenamiento, estado } = formData;

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
          navigate(`/home/training/mostrar-entrenamiento/${identrenamiento}`);
        }, 2000);
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

        <Box
          component="form"
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #BDBDBD",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "20px",
            width: "100%",
            gap: "1rem",
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <FormControl fullWidth required>
            <InputLabel id="select-jugadora">Jugadora</InputLabel>
            <Select
              labelId="select-jugadora"
              id="select-jugadora"
              value={formData.idjugadora}
              label="Jugadora"
              onChange={handleChange}
              name="idjugadora"
            >
              {datosJugadoras.map((jugadora) => (
                <MenuItem key={jugadora.idjugadora} value={jugadora.idjugadora}>
                  {jugadora.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{
              gap: 0.5,
              color: "white",
              backgroundColor: "#00338e",
              fontFamily: "'Open sans'",
              fontSize: "14px",
              fontWeight: 600,
              width: "12rem",
              "&:hover": {
                backgroundColor: "#AACBFF",
                color: "#00338e",
              },
            }}
            variant="contained"
            type="submit"
          >
            Guardar asistencia
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateVerification;
