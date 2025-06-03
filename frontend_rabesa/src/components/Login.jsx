import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { apiUrl } from "../config";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import useUserStore from "../stores/useUserStore";
import logoRabesa from "../assets/img/logo_rabesa.jpg";
import { playNotificationSound } from "../utils/Funciones";
import { enqueueSnackbar } from "notistack";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });
  const { setUser, clearUser } = useUserStore();
  const [validacion, setValidacion] = useState({
    correo: false,
    contraseña: false,
  });
  const notificacionError = useRef(null);
  const notificacion = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.correo === "" && formData.contrasena === "") {
      setValidacion({ correo: true, contraseña: true });
      return;
    }

    if (formData.correo === "") {
      setValidacion({ ...validacion, correo: true });
      return;
    }

    if (!formData.correo.includes("@gmail.com")) {
      playNotificationSound(notificacionError);

      enqueueSnackbar("El correo debe contener (@gmail.com)", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    if (formData.contrasena === "") {
      setValidacion({ ...validacion, contraseña: true });
      return;
    }

    if (formData.contrasena.length < 8) {
      playNotificationSound(notificacionError);

      enqueueSnackbar("La contraseña debe tener al menos 8 caracteres", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    try {
      const response = await fetch(apiUrl + "/usuario/login", {
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

        console.log("Respuesta login:", data.datos);
        setUser(data.datos);
        console.log("En localStorage:", localStorage.getItem("user-storage"));

        // Redirige tras el login exitoso
        setTimeout(() => {
          navigate("/home/dashboard");
        }, 1000);

        // Guardar token si lo usas
        localStorage.setItem("token", data.token);

        // Autologout después de 10 segundos
        setTimeout(() => {
          console.log("⏱️ Sesión expirada, limpiando token y usuario");
          localStorage.removeItem("token");
          clearUser();
          navigate("/login");
        }, 30 * 60 * 1000);
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
    setFormData({ ...formData, [name]: value });
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
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F1F8FF",
          px: 2, // padding horizontal para móviles
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #BDBDBD",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "20px",
            gap: "1rem",
            width: "100%",
            maxWidth: "400px", // tope para escritorio
            boxSizing: "border-box",
          }}
        >
          <img
            src={logoRabesa}
            style={{ width: "4rem", alignSelf: "center" }}
            alt="Logo Rabesa"
          />
          <Typography
            sx={{
              fontFamily: "'Open sans'",
              fontSize: "22px",
              color: "black",
              textAlign: "center",
            }}
          >
            Iniciar sesión en Rabesa Femenino
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              width: "100%",
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Typography
              sx={{
                fontFamily: "'Open sans'",
                fontSize: "15px",
                color: "black",
              }}
            >
              Correo electrónico *
            </Typography>
            <TextField
              hiddenLabel
              variant="outlined"
              name="correo"
              placeholder="Introduce tu correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              fullWidth
              required
              error={validacion.correo && !formData.correo}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon sx={{ color: "#a6a6a6", fontSize: "20px" }} />
                  </InputAdornment>
                ),
              }}
            />
            {validacion.correo && !formData.correo && (
              <FormHelperText error>Campo obligatorio</FormHelperText>
            )}

            <Typography
              sx={{
                fontFamily: "'Open sans'",
                fontSize: "15px",
                color: "black",
              }}
            >
              Contraseña *
            </Typography>
            <TextField
              hiddenLabel
              variant="outlined"
              type="password"
              name="contrasena"
              placeholder="Introduce tu contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              fullWidth
              required
              error={validacion.contraseña && !formData.contrasena}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#a6a6a6", fontSize: "20px" }} />
                  </InputAdornment>
                ),
              }}
            />
            {validacion.contraseña && !formData.contrasena && (
              <FormHelperText error>Campo obligatorio</FormHelperText>
            )}

            <Button
              sx={{
                color: "white",
                backgroundColor: "#00338e",
                fontFamily: "'Open sans'",
                fontSize: "14px",
                fontWeight: 600,
                mt: 2,
                mb: 1,
                alignSelf: "center",
                width: "100%",
                maxWidth: "160px",
                "&:hover": {
                  backgroundColor: "#AACBFF",
                  color: "#00338e",
                },
              }}
              type="submit"
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Login;
