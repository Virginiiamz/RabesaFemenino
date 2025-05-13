import {
  Box,
  Button,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SubjectIcon from "@mui/icons-material/Subject";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { playNotificationSound } from "../../utils/Funciones";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";

function ModifyClub() {
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "",
    estadio: "",
    imagen: null,
  });
  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);
  const notificacion_error = useRef(null);
  const [validacion, setValidacion] = useState({});

  useEffect(() => {
    async function getClubById() {
      let response = await fetch(apiUrl + "/clubs/" + params.idclub);
      if (response.ok) {
        let data = await response.json();
        setFormData(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/home/club");
      }
    }

    getClubById();
  }, []);

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre del club es obligatorio";
    } else if (formData.nombre.length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (formData.nombre.length > 12) {
      nuevosErrores.nombre = "El nombre no puede tener más de 12 caracteres";
    }

    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = "La ciudad es obligatoria";
    } else if (formData.ciudad.length < 3) {
      nuevosErrores.ciudad = "La ciudad debe tener al menos 3 caracteres";
    }

    if (!formData.estadio.trim()) {
      nuevosErrores.estadio = "La ubicación del campo es obligatoria";
    } else if (formData.estadio.length < 3) {
      nuevosErrores.estadio =
        "La ubicación del campo debe tener al menos 3 caracteres";
    }

    setValidacion(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarCampos();

    if (!esValido) return;

    // Crear un objeto FormData
    const formDataToSend = new FormData();

    // Agregar los campos al FormData
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("ciudad", formData.ciudad);
    formDataToSend.append("estadio", formData.estadio);

    // Agregar la imagen si existe
    if (formData.imagen) {
      formDataToSend.append("imagen", formData.imagen);
    }

    try {
      const response = await fetch(apiUrl + "/clubs/" + params.idclub, {
        method: "PUT",
        body: formDataToSend, // Enviar el FormData
        credentials: "include",
      });

      if (response.status == 204) {
        playNotificationSound(notificacion);

        enqueueSnackbar("Club modificado correctamente.", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        setTimeout(() => {
          navigate("/home/club");
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
    setFormData({ ...formData, [name]: value });
  };

  // Nueva función para manejar la imagen
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
              Modificar club
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Link to="/home/club">
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
            Información del club
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
                Nombre del equipo *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Introduce el nombre del equipo"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SubjectIcon
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
                  marginTop: 2,
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Ciudad *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="ciudad"
                type="text"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Introduce la ciudad"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SubjectIcon
                        sx={{ color: "#a6a6a6", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.ciudad}
                helperText={validacion.ciudad}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 0, md: 2 },
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
                Ubicación del campo *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="estadio"
                type="text"
                value={formData.estadio}
                onChange={handleChange}
                placeholder="Introduce la ubicación del campo"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon sx={{ color: "#a6a6a6", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                error={!!validacion.estadio}
                helperText={validacion.estadio}
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

        {/* <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <TextField
            id="outlined-basic"
            label="Nombre"
            variant="outlined"
            name="nombre"
            value={formData.nombre}
            type="text"
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Ciudad"
            variant="outlined"
            name="ciudad"
            value={formData.ciudad}
            type="text"
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Estadio"
            variant="outlined"
            name="estadio"
            value={formData.estadio}
            type="text"
            onChange={handleChange}
          />
          <TextField
            id="imagen"
            variant="outlined"
            type="file"
            name="imagen"
            onChange={handleFileChange}
          />
          <Button variant="outlined" type="submit">
            Modificar club
          </Button>
        </Box> */}
      </Box>
    </>
  );
}

export default ModifyClub;
