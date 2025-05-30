import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { playNotificationSound } from "../../utils/Funciones";
import { enqueueSnackbar } from "notistack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimerIcon from "@mui/icons-material/Timer";

function ModifyTraining() {
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    fecha_entrenamiento: new Date().toISOString().split("T")[0],
    hora_inicio: "00:00", // Sin segundos
    hora_final: "00:00", // Sin segundos
    tipo: "",
    informacion: "",
  });
  const notificacionError = useRef(null);
  const notificacion = useRef(null);
  const [validacion, setValidacion] = useState({});

  useEffect(() => {
    async function getEntrenamientoById() {
      let response = await fetch(
        apiUrl + "/entrenamientos/" + params.identrenamiento
      );
      if (response.ok) {
        let data = await response.json();
        setFormData(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/home/training"); // Volver a la página principal por ruta erronea
      }
    }

    getEntrenamientoById();
  }, []);

  const validarCampos = () => {
    const nuevosErrores = {};

    if (formData.tipo === "Default") {
      nuevosErrores.tipo = "El tipo de entrenamiento es obligatorio";
    }

    if (!formData.fecha_entrenamiento) {
      nuevosErrores.fecha_entrenamiento =
        "La fecha de entrenamiento es obligatoria";
    }

    if (!formData.hora_inicio) {
      nuevosErrores.hora_inicio = "La hora de inicio es obligatoria";
    }
    if (!formData.hora_final) {
      nuevosErrores.hora_final = "La hora de fin es obligatoria";
    }

    setValidacion(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.hora_inicio == formData.hora_final) {
      playNotificationSound(notificacionError);

      enqueueSnackbar("Ambas horas tienen que ser distintas", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    if (formData.hora_inicio && formData.hora_final) {
      const toMinutes = (h, m) => h * 60 + m;
      const [hi, mi] = formData.hora_inicio.split(":").map(Number);
      const [hf, mf] = formData.hora_final.split(":").map(Number);

      const inicioMin = toMinutes(hi, mi);
      const finalMin = toMinutes(hf, mf);

      const APERTURA = toMinutes(8, 0); // 08:00
      const CIERRE = toMinutes(23, 0); // 23:00

      // 1. No permitir horas iguales
      if (inicioMin === finalMin) {
        playNotificationSound(notificacionError);
        enqueueSnackbar("Las horas no pueden ser iguales", {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }

      // 2. Validar rango permitido para ambas horas
      if (
        inicioMin < APERTURA ||
        inicioMin > CIERRE ||
        finalMin < APERTURA ||
        finalMin > CIERRE
      ) {
        playNotificationSound(notificacionError);
        enqueueSnackbar("El horario permitido es de 08:00 a 23:00", {
          variant: "error",
          autoHideDuration: 4000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }

      // 3. Validar que hora final sea mayor a hora inicio, sin cruzar medianoche
      if (finalMin <= inicioMin) {
        playNotificationSound(notificacionError);
        enqueueSnackbar(
          "La hora final debe ser posterior a la hora inicio y en el mismo día",
          {
            variant: "error",
            autoHideDuration: 4000,
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
          }
        );
        return;
      }
    }

    const esValido = validarCampos();

    if (!esValido) return;

    try {
      const response = await fetch(
        apiUrl + "/entrenamientos/" + params.identrenamiento,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 400) {
        let errorData = await response.json();
        playNotificationSound(notificacionError);

        enqueueSnackbar(errorData.mensaje, {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      }

      if (response.status == 204) {
        playNotificationSound(notificacion);

        enqueueSnackbar("Entrenamiento modificado correctamente", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        setTimeout(() => {
          navigate("/home/training");
        }, 1000);
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
    let formattedValue = value;

    // Si es una hora, aseguramos formato HH:mm:ss
    if (name === "hora_inicio" || name === "hora_final") {
      formattedValue = value.length === 5 ? value + ":00" : value; // Si es HH:mm, añadimos ":00"
    }

    setFormData({ ...formData, [name]: formattedValue });
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
            <EditCalendarIcon sx={{ fontSize: "26px" }}></EditCalendarIcon>{" "}
            Editar entrenamiento
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
          }}
          sx={{ width: "100%" }}
        >
          <Typography
            sx={{
              color: "#3d64a8",
              fontFamily: "'Open sans'",
              fontWeight: 600,
            }}
          >
            Información del entrenamiento
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%", // Asegura que no haya limitación de ancho
              marginTop: 2
            }}
          >
            <Grid container spacing={3} sx={{ width: "100%" }}>
              {/* Primera fila - Tipo y Descripción */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  required
                  error={!!validacion.tipo}
                  helperText={validacion.tipo}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Open sans'",
                      fontWeight: 600,
                      fontSize: "13px",
                      marginBottom: 1,
                      color: "#3d64a8",
                    }}
                  >
                    Tipo entrenamiento *
                  </Typography>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="Default" disabled>
                      Seleccione un tipo de entrenamiento
                    </MenuItem>
                    <MenuItem value="Técnico">Técnico</MenuItem>
                    <MenuItem value="Táctico">Táctico</MenuItem>
                    <MenuItem value="Físico">Físico</MenuItem>
                    <MenuItem value="Integrado">Integrado</MenuItem>
                    <MenuItem value="Mental y psicológico">
                      Mental y psicológico
                    </MenuItem>
                  </Select>
                </FormControl>
                {validacion.tipo && (
                  <FormHelperText error>
                    El tipo de entrenamiento es obligatorio
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontFamily: "'Open sans'",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginBottom: 1,
                    color: "#3d64a8",
                  }}
                >
                  Fecha de entrenamiento *
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  name="fecha_entrenamiento"
                  value={formData.fecha_entrenamiento}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon
                          sx={{ color: "#a6a6a6", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  required={true}
                  error={!!validacion.fecha_entrenamiento}
                  helperText={validacion.fecha_entrenamiento}
                />
              </Grid>

              {/* Tercera fila - Horas */}
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontFamily: "'Open sans'",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginBottom: 1,
                    color: "#3d64a8",
                  }}
                >
                  Hora inicio *
                </Typography>
                <TextField
                  fullWidth
                  type="time"
                  name="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimerIcon
                          sx={{ color: "#a6a6a6", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required={true}
                  error={!!validacion.hora_inicio}
                  helperText={validacion.hora_inicio}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontFamily: "'Open sans'",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginBottom: 1,
                    color: "#3d64a8",
                  }}
                >
                  Hora final *
                </Typography>
                <TextField
                  fullWidth
                  type="time"
                  name="hora_final"
                  value={formData.hora_final}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimerIcon
                          sx={{ color: "#a6a6a6", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  required={true}
                  error={!!validacion.hora_final}
                  helperText={validacion.hora_final}
                />
              </Grid>

              {/* Segunda fila - Fecha */}
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontFamily: "'Open sans'",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginBottom: 1,
                    color: "#3d64a8",
                  }}
                >
                  Descripción *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="informacion"
                  value={formData.informacion}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={3} lg={2}>
                <Button
                  fullWidth
                  size="large"
                  onClick={handleSubmit}
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
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ModifyTraining;
