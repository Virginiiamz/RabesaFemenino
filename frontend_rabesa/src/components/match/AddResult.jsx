import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";
import { Icon } from "@iconify-icon/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import NumbersIcon from "@mui/icons-material/Numbers";
import { playNotificationSound } from "../../utils/Funciones";

function AddResult() {
  const params = useParams();
  const [formData, setFormData] = useState({
    resultado: "",
  });
  const [golesRabesa, setGolesRabesa] = useState("");
  const [golesRival, setGolesRival] = useState("");
  const [validacion, setValidacion] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);
  const notificacion_error = useRef(null);
  const navigate = useNavigate();

  const validarCampos = () => {
    const nuevosErrores = {};

    if (golesRabesa < 0) {
      nuevosErrores.golesRabesa = "Los goles no pueden ser negativos";
    }

    if (golesRival < 0) {
      nuevosErrores.golesRival = "Los goles no pueden ser negativos";
    }

    if (golesRabesa === "") {
      nuevosErrores.golesRabesa = "Campo obligatorio";
    }

    if (golesRival === "") {
      nuevosErrores.golesRival = "Campo obligatorio";
    }

    if (
      (golesRabesa === "" && golesRival !== "") ||
      (golesRabesa !== "" && golesRival === "")
    ) {
      nuevosErrores.golesRabesa = "Debes introducir los goles de ambos equipos";
      nuevosErrores.golesRival = "Debes introducir los goles de ambos equipos";
    }

    setValidacion(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarCampos();

    if (!esValido) return;

    if (golesRabesa !== "" && golesRival !== "") {
      formData.resultado = golesRabesa + "-" + golesRival;
    }

    try {
      const response = await fetch(
        apiUrl + "/partidos/anadir-resultado/" + params.idpartido,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.status == 204) {
        playNotificationSound(notificacion);

        enqueueSnackbar("Guardado con éxito", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        setTimeout(() => {
          navigate("/home/partidos");
        }, 1000);
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
            <iconify-icon
              icon="material-symbols:scoreboard-rounded"
              width="28"
              height="28"
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
              Añadir resultado
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
            Información del partido
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 0, md: 2 },
              marginBottom: 2,
              marginTop: 2,
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

export default AddResult;
