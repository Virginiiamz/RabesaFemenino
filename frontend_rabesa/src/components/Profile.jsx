import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import NumbersIcon from "@mui/icons-material/Numbers";
import LogoutIcon from "@mui/icons-material/Logout";
import useUserStore from "../stores/useUserStore";
import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../config";
import { Link, Navigate } from "react-router";
import { useSnackbar } from "notistack";
import { playNotificationSound } from "../utils/Funciones";

function Profile() {
  const { user } = useUserStore();
  const [datosUsuario, setDatosUsuario] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    edad: 0,
    correo: "",
    contrasena: "",
    esEntrenador: false,
  });

  const [validacion, setValidacion] = useState({});
  const fileInputRef = useRef(null);
  const [idProfile, setIdProfile] = useState(-1);

  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);
  const notificacion_error = useRef(null);

  let entrenador = false;

  if (user.rol == "Entrenador") {
    entrenador = true;
  }

  useEffect(() => {
    const showNotification = localStorage.getItem(
      "showProfileUpdateNotification"
    );
    if (showNotification) {
      playNotificationSound(notificacion);
      enqueueSnackbar("Imagen de perfil actualizada correctamente", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      localStorage.removeItem("showProfileUpdateNotification");
    }

    async function getEntrenadorByIdUsuario() {
      let response = await fetch(
        apiUrl + "/entrenadores/datos/" + user.idusuario,
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
        setDatosUsuario(data.datos);
        setFormData({
          ...data.datos,
          esEntrenador: true,
        });
        setIdProfile(data.datos.identrenador);
      }
    }

    async function getJugadoraByIdUsuario() {
      let response = await fetch(
        apiUrl + "/jugadoras/datos/" + user.idusuario,
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
        setDatosUsuario(data.datos);
        setFormData({
          ...data.datos,
          esEntrenador: false,
        });
        setIdProfile(data.datos.idjugadora);
      }
    }

    if (entrenador) {
      getEntrenadorByIdUsuario();
    } else {
      getJugadoraByIdUsuario();
    }
  }, []);

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

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.length < 4) {
      nuevosErrores.nombre =
        "El nombre debe tener una longitud mínima de 4 carácteres";
    }

    if (formData.contrasena) {
      if (formData.contrasena.length < 8) {
        nuevosErrores.contrasena =
          "La contraseña debe tener una longitud mínima de 8 carácteres";
        formData.contrasena = null;
      }
    }

    if (formData.edad < 18) {
      nuevosErrores.edad = "La edad no puede ser menor de 18 años";
    }

    setValidacion(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarCampos();

    if (!esValido) return;

    try {
      const response = await fetch(apiUrl + "/usuario/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
        body: JSON.stringify(formData),
      });

      if (response.status == 204) {
        playNotificationSound(notificacion);

        enqueueSnackbar("Perfil modificado correctamente", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        setTimeout(() => {
          Navigate("/home/profile");
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

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validación básica del tipo de archivo
    if (!file.type.match("image.*")) {
      enqueueSnackbar("Selecciona un archivo de imagen válido", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("imagen", file);
      formDataToSend.append(
        formData.esEntrenador ? "identrenador" : "idjugadora",
        idProfile
      );

      const response = await fetch(apiUrl + "/usuario/updatePhoto", {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      });

      if (response.status === 204) {
        // Guardar en localStorage antes de recargar
        localStorage.setItem("showProfileUpdateNotification", "true");
        window.location.reload();
      } else {
        const data = await response.json();
        playNotificationSound(notificacion_error);
        enqueueSnackbar(data.mensaje || "Error al actualizar la imagen", {
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
    } finally {
      event.target.value = ""; // Limpiar el input
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
            marginBottom: "5px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              Perfil de usuario
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Link to="/">
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
                <Tooltip title="Cerrar sesión">
                  <LogoutIcon></LogoutIcon>
                </Tooltip>
              </Button>
            </Link>
          </Box>
        </div>
        <Box sx={{ marginBottom: "10px" }}>
          <Typography variant="body1">
            Actualiza tu información personal
          </Typography>
        </Box>
        <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", lg: "row" },
            gap: "3rem",
          }}
        >
          <Box
            sx={{
              border: "1px solid #BDBDBD",
              width: { xs: "100%", lg: "30%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "4px",
              padding: 2,
              height: "24rem",
            }}
          >
            <div style={{ position: "relative", width: "fit-content" }}>
              <img
                src={`http://localhost:3000/uploads/${datosUsuario.imagen}`}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Input file oculto */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              {/* Icono de cámara */}
              <div
                onClick={handleIconClick}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                  padding: "5px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  color: "#3d64a8",
                }}
              >
                <AddAPhotoIcon></AddAPhotoIcon>
              </div>
            </div>
            <Typography
              sx={{
                color: "#3d64a8",
                fontFamily: "'Open sans'",
                fontWeight: 600,
                marginTop: "1rem",
              }}
            >
              {datosUsuario.nombre}
            </Typography>
            <Typography
              sx={{
                fontSize: { lg: "16px" },
                fontFamily: "Open Sans",
              }}
            >
              {!entrenador
                ? datosUsuario.posicion + " · #" + datosUsuario.numero_camiseta
                : datosUsuario.rol}
            </Typography>
            <Button
              size="large"
              onClick={handleIconClick}
              sx={{
                gap: 0.5,
                color: "#838383",
                border: "1px solid #838383",
                backgroundColor: "white",
                fontFamily: "'Open sans'",
                fontSize: "14px",
                fontWeight: 600,
                marginTop: "1rem",
                width: "90%",
              }}
            >
              <FileUploadIcon sx={{ fontSize: "20px" }}></FileUploadIcon>{" "}
              Cambiar foto
            </Button>
            <Divider
              sx={{ my: 2, backgroundColor: "#3d64a8", width: "100%" }}
            />
            <Box sx={{ alignSelf: "flex-start" }}>
              <Typography
                sx={{
                  color: "#3d64a8",
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                }}
              >
                Fecha alta
              </Typography>
              <Typography
                sx={{
                  fontSize: { lg: "16px" },
                  fontFamily: "Open Sans",
                }}
              >
                {new Date(datosUsuario.fecha_ingreso).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{ width: { xs: "100%", lg: "70%" } }}
          >
            <Box
              sx={{
                border: "1px solid #BDBDBD",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "4px",
                paddingX: 2,
                marginBottom: "1rem",
                paddingBottom: "2rem",
              }}
            >
              <Box
                sx={{
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#3d64a8",
                      fontFamily: "'Open sans'",
                      fontWeight: 600,
                    }}
                  >
                    Información personal
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { lg: "16px" },
                      fontFamily: "Open Sans",
                    }}
                  >
                    Actualice sus datos personales
                  </Typography>
                </Box>
                <SettingsIcon sx={{ color: "#3d64a8" }}></SettingsIcon>
              </Box>
              <Divider
                sx={{ my: 2, backgroundColor: "#3d64a8", width: "100%" }}
              />

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
                      marginTop: 1,
                      marginBottom: 1,
                      color: "#3d64a8",
                    }}
                  >
                    Nombre completo
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Introduce tu nombre completo"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{ color: "#a6a6a6", fontSize: "20px" }}
                          />
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
                      marginTop: 1,
                      marginBottom: 1,
                      color: "#3d64a8",
                    }}
                  >
                    Correo electrónico
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="Introduce tu correo electrónico"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{ color: "#a6a6a6", fontSize: "20px" }}
                          />
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
              </Box>
              <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <Typography
                  sx={{
                    fontFamily: "'Open sans'",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: 1,
                    marginBottom: 1,
                    color: "#3d64a8",
                  }}
                >
                  Edad
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="edad"
                  type="number"
                  value={formData.edad}
                  onChange={handleChange}
                  placeholder="Introduce tu edad"
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
                  error={!!validacion.edad}
                  helperText={validacion.edad}
                />
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid #BDBDBD",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "4px",
                paddingX: 2,
                marginBottom: "1rem",
                paddingBottom: "2rem",
              }}
            >
              <Box
                sx={{
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#3d64a8",
                      fontFamily: "'Open sans'",
                      fontWeight: 600,
                    }}
                  >
                    Seguridad
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { lg: "16px" },
                      fontFamily: "Open Sans",
                    }}
                  >
                    Gestione su contraseña
                  </Typography>
                </Box>
                <LockIcon sx={{ color: "#3d64a8" }}></LockIcon>
              </Box>
              <Divider
                sx={{ my: 2, backgroundColor: "#3d64a8", width: "100%" }}
              />

              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Contraseña actual
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                value="1234567891234567"
                placeholder="Introduce tu contraseña actual"
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
                disabled={true}
              />
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
                Nueva contraseña
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="contrasena"
                type="password"
                onBlur={validacion.contrasena}
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Introduce una nueva contraseña"
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
      </Box>
    </>
  );
}
export default Profile;
