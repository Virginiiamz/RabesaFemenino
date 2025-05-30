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
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../config";
import { useSnackbar } from "notistack";
import { playNotificationSound } from "../../utils/Funciones";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Icon } from "@iconify-icon/react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import NumbersIcon from "@mui/icons-material/Numbers";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

function CreateTrainer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    nombre: "",
    edad: 0,
    rol: "Default",
    imagen: null,
    fecha_ingreso: "",
    idclub: 1,
  });

  const [validacion, setValidacion] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);
  const notificacion_error = useRef(null);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch(apiUrl + "/entrenadores", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
  //       body: JSON.stringify(formData),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert(data.mensaje);
  //       navigate("/home/team"); // Redirige tras el login exitoso
  //     } else {
  //       alert(data.mensaje);
  //       // setErrors({ apiError: data.mensaje || "Credenciales incorrectas." });
  //     }
  //   } catch (error) {
  //     alert("Error de red. Inténtalo de nuevo más tarde.");
  //   }
  // };
  const validarCampos = () => {
    const nuevosErrores = {};

    if (!formData.correo.trim()) {
      nuevosErrores.correo = "El correo electrónico es obligatorio";
    } else {
      // Expresión regular para validar el formato del correo electrónico
      const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!correoRegex.test(formData.correo)) {
        nuevosErrores.correo = "Por favor ingresa un correo electrónico válido";
      }
    }

    if (!formData.contrasena.trim()) {
      nuevosErrores.contrasena = "La contraseña es obligatoria";
    } else if (formData.contrasena.length < 8) {
      nuevosErrores.contrasena =
        "La contraseña debe tener una longitud mínima de 8 carácteres";
    }

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

    if (formData.rol === "Default") {
      nuevosErrores.rol = "Debes seleccionar un rol para el entrenador";
    }

    if (formData.fecha_ingreso === "") {
      nuevosErrores.fecha_ingreso = "La fecha de ingreso es obligatoria";
    }

    setValidacion(nuevosErrores);

    // Devuelve true si no hay errores
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarCampos();

    if (!esValido) return;

    const formDataToSend = new FormData();
    formDataToSend.append("correo", formData.correo);
    formDataToSend.append("contrasena", formData.contrasena);
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("edad", formData.edad);
    formDataToSend.append("rol", formData.rol);
    formDataToSend.append("fecha_ingreso", formData.fecha_ingreso);
    formDataToSend.append("idclub", formData.idclub);
    if (formData.imagen) {
      formDataToSend.append("imagen", formData.imagen); // Agrega la imagen
    }

    try {
      const response = await fetch(apiUrl + "/entrenadores", {
        method: "POST",
        body: formDataToSend, // Enviamos FormData en lugar de JSON
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
          navigate("/home/team");
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
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar la imagen
  const handleFileChange = (e) => {
    setFormData({ ...formData, imagen: e.target.files[0] });
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
            <iconify-icon
              icon="mdi:whistle"
              width="26"
              height="26"
            ></iconify-icon>
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
              Crear entrenador
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
            borderRadius: "4px",
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
              flexDirection: {xs: "column", md: "row"},
              gap: {xs: 0, md: 2},
              marginBottom: 2,
            }}
          >
            <Box sx={{ width: {xs: "100%", md: "50%"} }}>
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
                Correo electrónico *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Introduce un email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#a6a6a6", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.correo}
                helperText={validacion.correo}
              />
            </Box>
            <Box sx={{ width: {xs: "100%", md: "50%"} }}>
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
                Contraseña *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Introduce una contraseña"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#a6a6a6", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.contrasena}
                helperText={validacion.contrasena}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: {xs: "column", md: "row"},
              gap: {xs: 0, md: 2},
              marginBottom: 2,
            }}
          >
            <Box sx={{ width: {xs: "100%", md: "50%"} }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
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
                placeholder="Introduce tu nombre completo"
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
            <Box sx={{ width: {xs: "100%", md: "50%"} }}>
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
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
                placeholder="Introduce tu edad"
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

          <Box
            sx={{
              display: "flex",
              flexDirection: {xs: "column", md: "row"},
              gap: {xs: 0, md: 2},
              marginBottom: 2,
            }}
          >
            <Box sx={{ width: {xs: "100%", md: "50%"} }}>
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
                Tipo de entrenador *
              </Typography>
              <FormControl fullWidth required>
                <Select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Introduce un tipo de entrenador"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!validacion.posicion}
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
                  <MenuItem value="Preparador físico">
                    Preparador físico
                  </MenuItem>
                  <MenuItem value="Entrenador de porteros">
                    Entrenador de porteros
                  </MenuItem>
                </Select>
              </FormControl>
              {validacion.rol && (
                <FormHelperText error>
                  Debes seleccionar el rol del entrenador
                </FormHelperText>
              )}
            </Box>
            <Box sx={{ width: {xs: "100%", md: "50%"} }}>
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
                Fecha de alta *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                name="fecha_ingreso"
                value={formData.fecha_ingreso}
                onChange={handleChange}
                placeholder="Introduce una fecha de ingreso"
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
                error={!!validacion.fecha_ingreso}
                helperText={validacion.fecha_ingreso}
              />
            </Box>
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Open sans'",
                fontWeight: 600,
                fontSize: "13px",
                marginBottom: 1,
                color: "#3d64a8",
              }}
            >
              Foto de perfil
            </Typography>
            <TextField
              fullWidth
              id="imagen"
              variant="outlined"
              type="file"
              name="imagen"
              onChange={handleFileChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InsertPhotoIcon
                      sx={{ color: "#a6a6a6", fontSize: "20px" }}
                    />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
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

export default CreateTrainer;
