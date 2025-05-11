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
import { Link, useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";
import { useSnackbar } from "notistack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { playNotificationSound } from "../../utils/Funciones";

function ModifyMatch() {
  const params = useParams();
  const [datosClubs, setDatosClubs] = useState([]);
  const [formData, setFormData] = useState({
    idrival: "",
    ubicacion: "",
    resultado: "",
    fecha_partido: "",
    hora: "", // Sin segundos
  });
  let [estadio, setEstadio] = useState([]);
  const navigate = useNavigate();
  const [validacion, setValidacion] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);
  const notificacion_error = useRef(null);

  useEffect(() => {
    async function getPartidoById() {
      let response = await fetch(apiUrl + "/partidos/" + params.idpartido);
      if (response.ok) {
        let data = await response.json();
        setFormData(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/home/partidos");
      }
    }

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
      }
    }

    getAllClubs();
    getPartidoById();
  }, []);

  useEffect(() => {
    if (formData.idrival && datosClubs.length > 0) {
      const rival = datosClubs.find(
        (club) => club.idclub === Number(formData.idrival)
      );
      if (rival) {
        const posiblesEstadios = ["Campo de Fútbol de Rabesa", rival.estadio];
        setEstadio(posiblesEstadios);

        // Si el estadio actual del form no está en las opciones, lo limpiamos
        if (!posiblesEstadios.includes(formData.ubicacion)) {
          setFormData((prev) => ({
            ...prev,
            ubicacion: "Default",
          }));
        }
      }
    }
  }, [formData.idrival, datosClubs]);

  const validarCampos = () => {
    const nuevosErrores = {};

    if (formData.ubicacion === "Default") {
      nuevosErrores.ubicacion =
        "Debes seleccionar una ubicación para el partido";
    }

    if (formData.hora > "22:00") {
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

    try {
      const response = await fetch(apiUrl + "/partidos/" + params.idpartido, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.status == 204) {
        playNotificationSound(notificacion);

        enqueueSnackbar("Partido modificado correctamente.", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        setTimeout(() => {
          navigate("/home/partidos");
        }, 1000);
      } else {
        const data = await response.json();

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
    let formattedValue = value;

    // Si es una hora, aseguramos formato HH:mm:ss
    if (name === "hora") {
      formattedValue = value.length === 5 ? value + ":00" : value; // Si es HH:mm, añadimos ":00"
    }

    if (name === "idrival") {
      const idSeleccionado = Number(value);
      const rival = datosClubs.find((club) => club.idclub === idSeleccionado);

      if (rival) {
        setFormData((prev) => ({
          ...prev,
          [name]: idSeleccionado,
          ubicacion: "", // Forzamos a que vuelva a elegir ubicación
        }));
        setEstadio(["Campo de Fútbol de Rabesa", rival.estadio]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
            <EditIcon></EditIcon>
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
              Modificar partido
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
                disabled={
                  formData.resultado.trim() !== ""
                }
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

export default ModifyMatch;
