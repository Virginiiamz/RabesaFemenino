import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import NumbersIcon from "@mui/icons-material/Numbers";
import { playNotificationSound } from "../../utils/Funciones";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";

function ModifyTrainer() {
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    nombre: "",
    edad: 0,
    rol: "",
    idclub: 1,
  });

  const [validacion, setValidacion] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);
  const notificacion_error = useRef(null);

  useEffect(() => {
    async function getEntrenadorById() {
      let response = await fetch(
        apiUrl + "/entrenadores/" + params.identrenador
      );
      if (response.ok) {
        let data = await response.json();
        setFormData(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/home/team"); // Volver a la página principal por ruta erronea
      }
    }

    getEntrenadorById();
  }, []);

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.length < 4) {
      nuevosErrores.nombre =
        "El nombre debe tener una longitud mínima de 4 carácteres";
    }

    if (formData.edad < 16) {
      nuevosErrores.edad = "La edad no puede ser menor de 16 años";
    } else if (formData.edad > 66) {
      nuevosErrores.edad = "La edad no puede ser mayor de 66 años";
    }

    setValidacion(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarCampos();

    if (!esValido) return;

    try {
      const response = await fetch(
        apiUrl + "/entrenadores/" + params.identrenador,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
          body: JSON.stringify(formData),
        }
      );

      if (response.status == 204) {
        playNotificationSound(notificacion);

        enqueueSnackbar("Entrenador modificado correctamente", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        setTimeout(() => {
          navigate("/home/team");
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
              Modificar entrenador
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Link to="/home/team">
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
            Información básica
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
                Nombre *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Introduce un nombre"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#a6a6a6", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.nombre}
                helperText={validacion.nombre}
              />
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
                Edad *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                placeholder="Introduce una edad"
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.edad}
                helperText={validacion.edad}
              />
            </Box>
          </Box>
          <Typography
            sx={{
              color: "#3d64a8",
              fontFamily: "'Open sans'",
              fontWeight: 600,
            }}
          >
            Información de equipo
          </Typography>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Open sans'",
                fontWeight: 600,
                fontSize: "13px",
                marginBottom: 1,
                marginTop: 2,
                color: "#3d64a8",
              }}
            >
              Tipo de entrenador *
            </Typography>
            <FormControl fullWidth required error={!!validacion.rol}>
              <Select
                type="text"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Introduce un tipo de entrenador"
                InputLabelProps={{
                  shrink: true,
                }}
              >
                <MenuItem value="Default" disabled>
                  Seleccione un tipo de entrenador
                </MenuItem>
                <MenuItem value="Entrenador principal">
                  Entrenador principal
                </MenuItem>
                <MenuItem value="Entrenador asistente">
                  Entrenador asistente
                </MenuItem>
                <MenuItem value="Preparador físico">Preparador físico</MenuItem>
                <MenuItem value="Entrenador de porteros">
                  Entrenador de porteros
                </MenuItem>
              </Select>
            </FormControl>
            {validacion.rol && (
              <FormHelperText error>
                Debes seleccionar el tipo de entrenador
              </FormHelperText>
            )}
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
              marginTop: 2,
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

export default ModifyTrainer;
