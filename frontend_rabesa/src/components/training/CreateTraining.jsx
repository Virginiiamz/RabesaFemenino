import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../config";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { playNotificationSound } from "../../utils/Funciones";
import { useSnackbar } from "notistack";

function CreateTraining() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fecha_entrenamiento: null,
    hora_inicio: 0,
    hora_final: 0,
    tipo: "",
    informacion: "",
  });
  const [validacion, setValidacion] = useState({
    tipo: false,
    fecha_entrenamiento: false,
    fecha_atrasada: false,
    hora_inicio: false,
    hora_final: false,
  });
  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tipo) {
      setValidacion({ ...validacion, tipo: true });
      return;
    }

    if (!formData.fecha_entrenamiento) {
      setValidacion({ ...validacion, fecha_entrenamiento: true });
      return;
    } else {
      const hoy = new Date().toISOString().split("T")[0];
      if (formData.fecha_entrenamiento < hoy) {
        setValidacion({ ...validacion, fecha_atrasada: true });
        return;
      }
    }

    if (!formData.hora_inicio) {
      setValidacion({ ...validacion, hora_inicio: true });
      return;
    }
    if (!formData.hora_final) {
      setValidacion({ ...validacion, hora_final: true });
      return;
    }

    try {
      const response = await fetch(apiUrl + "/entrenamientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
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
          navigate("/home/training");
        }, 3500);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
            <InsertInvitationIcon
              sx={{ fontSize: "26px" }}
            ></InsertInvitationIcon>{" "}
            Crear entrenamiento
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
            borderRadius: "10px",
            padding: "20px",
            width: "100%",
          }}
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%", // Asegura que no haya limitación de ancho
              padding: 2, // Añade un poco de espacio interno
            }}
          >
            <Grid container spacing={3} sx={{ width: "100%" }}>
              {/* Primera fila - Tipo y Descripción */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={validacion.tipo}>
                  <InputLabel id="select-tipo">Tipo</InputLabel>
                  <Select
                    labelId="select-tipo"
                    id="select-tipo"
                    name="tipo"
                    value={formData.tipo}
                    label="Tipo"
                    onChange={handleChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="Técnico">Técnico</MenuItem>
                    <MenuItem value="Táctico">Táctico</MenuItem>
                    <MenuItem value="Físico">Físico</MenuItem>
                    <MenuItem value="Integrado">Integrado</MenuItem>
                    <MenuItem value="Mental y psicológico">
                      Mental y psicológico
                    </MenuItem>
                  </Select>
                  {validacion.tipo && (
                    <FormHelperText error>Campo obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de entrenamiento"
                  type="date"
                  variant="outlined"
                  name="fecha_entrenamiento"
                  value={formData.fecha_entrenamiento}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required={true}
                  error={
                    validacion.fecha_entrenamiento || validacion.fecha_atrasada
                  }
                />
                {validacion.fecha_entrenamiento && (
                  <FormHelperText error>Campo obligatorio</FormHelperText>
                )}
                {validacion.fecha_atrasada && (
                  <FormHelperText error>
                    No puede ser una fecha ya pasada
                  </FormHelperText>
                )}
              </Grid>

              {/* Tercera fila - Horas */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora inicio"
                  type="time"
                  variant="outlined"
                  name="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // intervalos de 5 minutos
                  }}
                  required={true}
                  error={validacion.hora_inicio}
                />
                {validacion.hora_inicio && (
                  <FormHelperText error>Campo obligatorio</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora final"
                  type="time"
                  variant="outlined"
                  name="hora_final"
                  value={formData.hora_final}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // intervalos de 5 minutos
                  }}
                  required={true}
                  error={validacion.hora_final}
                />
                {validacion.hora_final && (
                  <FormHelperText error>Campo obligatorio</FormHelperText>
                )}
              </Grid>

              {/* Segunda fila - Fecha */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Descripción"
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

export default CreateTraining;
