import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../config";
import { useSnackbar } from "notistack";
import { playNotificationSound } from "../../utils/Funciones";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Icon } from "@iconify-icon/react";
import NumbersIcon from "@mui/icons-material/Numbers";
import { TbSoccerField } from "react-icons/tb";
import ShieldIcon from "@mui/icons-material/Shield";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

function CreateMatch() {
  const [datosClubs, setDatosClubs] = useState([]);
  const [formData, setFormData] = useState({
    idrival: "Default",
    resultado: "",
    ubicacion: "Default",
    hora: "",
    fecha_partido: "",
  });
  const [golesRabesa, setGolesRabesa] = useState("");
  const [golesRival, setGolesRival] = useState("");
  let [estadio, setEstadio] = useState([]);
  const navigate = useNavigate();
  const [validacion, setValidacion] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);
  const notificacion_error = useRef(null);

  useEffect(() => {
    async function getAllClubs() {
      let response = await fetch(apiUrl + "/clubs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setDatosClubs(data.datos);
        // const estadiosUnicos = [
        //   ...new Set([
        //     ...data.datos.map((club) => club.estadio),
        //     "Campo de Fútbol de Rabesa",
        //   ]),
        // ];
        // setEstadio(estadiosUnicos);
      }
    }

    getAllClubs();
  }, []);

  const validarCampos = () => {
    const nuevosErrores = {};

    if (formData.idrival === "Default") {
      nuevosErrores.idrival = "Debes seleccionar un rival";
    }

    if (formData.ubicacion === "Default") {
      nuevosErrores.ubicacion = "Debes seleccionar una ubicación";
    }

    if (golesRabesa < 0) {
      nuevosErrores.golesRabesa = "Los goles no pueden ser negativos";
    }

    if (golesRival < 0) {
      nuevosErrores.golesRival = "Los goles no pueden ser negativos";
    }

    if (golesRabesa === "" && golesRival !== "" || golesRabesa !== "" && golesRival === "") {
      nuevosErrores.golesRabesa = "Debes introducir los goles de ambos equipos";
      nuevosErrores.golesRival = "Debes introducir los goles de ambos equipos";
    }

    if (formData.fecha_partido === "") {
      nuevosErrores.fecha_partido = "Debes seleccionar una fecha de partido";
    }

    if (formData.hora === "") {
      nuevosErrores.hora = "Debes seleccionar una hora de partido";
    } else if (formData.hora > "22:00") {
      nuevosErrores.hora = "No se pueden crear partidos despues de las 22:00";
    } else if (formData.hora < "08:00") {
      nuevosErrores.hora =
        "No se pueden crear partidos desde de las 22:00 hasta las 08:00";
    }

    setValidacion(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarCampos();

    if (!esValido) return;

    if (golesRabesa === "" && golesRival === "") {
      formData.resultado = "";
    } else {
      formData.resultado = `${golesRabesa}-${golesRival}`;
    }

    try {
      const response = await fetch(apiUrl + "/partidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        playNotificationSound(notificacion);

        enqueueSnackbar(data.mensaje, {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        setTimeout(() => {
          navigate("/home/partidos");
        }, 1000);
      } else {
        playNotificationSound(notificacion_error);

        enqueueSnackbar(data.mensaje, {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      }
    } catch (error) {
      playNotificationSound(notificacion_error);

      enqueueSnackbar("Error de red. Inténtalo de nuevo más tarde.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "idrival") {
      const idSeleccionado = Number(value);
      const rival = datosClubs.find((club) => club.idclub === idSeleccionado);

      if (rival) {
        // Actualizar ubicación y los estadios disponibles
        setFormData((prev) => ({
          ...prev,
          [name]: idSeleccionado,
          ubicacion: "Default", // Limpiamos para que el usuario seleccione entre las 2 opciones
        }));
        setEstadio(["Campo de Fútbol de Rabesa", rival.estadio]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setGolesRabesa((prev) => (name === "resultadoRabesa" ? value : prev));
    setGolesRival((prev) => (name === "resultadoRival" ? value : prev));
  };

  return (
    <>
      <audio ref={notificacion} src="/sonido/notificacion.mp3" preload="auto" />
      <audio
        ref={notificacion_error}
        src="/sonido/notificacion_error.mp3"
        preload="auto"
      />
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#00338e",
            }}
          >
            <TbSoccerField style={{ fontSize: "30px" }} />
            <Typography
              sx={{
                fontFamily: "'Open Sans'",
                fontSize: "20px",
                fontWeight: 600,
                color: "#00338e",
                padding: 0,
                margin: 0,
              }}
            >
              Crear partido
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Link to="/home/partidos">
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
        </div>

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
            borderRadius: "10px",
            padding: "20px",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: "#3d64a8",
              fontFamily: "'Open sans'",
              fontWeight: 600,
            }}
          >
            Información del partido
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 0, md: 2 },
              marginBottom: 2,
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginTop: 2,
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Equipo rival *
              </Typography>
              <FormControl fullWidth required>
                <Select
                  name="idrival"
                  value={formData.idrival}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Selecciona a un rival"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!validacion.idrival}
                >
                  <MenuItem value="Default" disabled>
                    Seleccione un rival
                  </MenuItem>
                  {datosClubs.map((club) => (
                    <MenuItem key={club.idclub} value={club.idclub}>
                      {club.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {validacion.idrival && (
                <FormHelperText error>
                  Debes seleccionar un rival
                </FormHelperText>
              )}
            </Box>
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginTop: 2,
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Ubicación *
              </Typography>
              <FormControl fullWidth required>
                <Select
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Selecciona una ubicacion"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!validacion.ubicacion}
                >
                  <MenuItem value="Default" disabled>
                    Seleccione una ubicación
                  </MenuItem>
                  {estadio.map((estadio) => (
                    <MenuItem key={estadio} value={estadio}>
                      {estadio}
                    </MenuItem>
                  ))}
                </Select>
                {validacion.ubicacion && (
                  <FormHelperText error>
                    Debes seleccionar una ubicación para el partido
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 0, md: 2 },
              marginBottom: 2,
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Goles locales *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="resultadoRabesa"
                type="number"
                value={golesRabesa}
                onChange={handleChange}
                placeholder="Introduce el número de goles"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon
                        sx={{ color: "#a6a6a6", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.golesRabesa}
                helperText={validacion.golesRabesa}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Goles visitante *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="resultadoRival"
                type="number"
                value={golesRival}
                onChange={handleChange}
                placeholder="Introduce el número de goles"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon
                        sx={{ color: "#a6a6a6", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.golesRival}
                helperText={validacion.golesRival}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 0, md: 2 },
              marginBottom: 2,
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Fecha del partido *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                name="fecha_partido"
                value={formData.fecha_partido}
                onChange={handleChange}
                placeholder="Introduce una fecha de partido"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon
                        sx={{ color: "#a6a6a6", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.fecha_partido}
                helperText={validacion.fecha_partido}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Hora del partido *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="hora"
                value={formData.hora}
                type="time"
                onChange={handleChange}
                placeholder="Introduce una hora de partido"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessAlarmIcon
                        sx={{ color: "#a6a6a6", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.hora}
                helperText={validacion.hora}
              />
            </Box>
          </Box>
          <Button
            size="large"
            onClick={handleSubmit}
            sx={{
              gap: 0.5,
              color: "white",
              backgroundColor: "#00338e",
              fontFamily: "'Open sans'",
              fontSize: "14px",
              fontWeight: 600,
              alignSelf: "flex-start",
              width: "10rem",
              "&:hover": {
                backgroundColor: "#AACBFF",
                color: "#00338e",
              },
            }}
            type="submit"
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateMatch;
