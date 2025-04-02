import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

function CreateVerification() {
  const { identrenamiento, tipoconfirmacion } = useParams();
  const [datosJugadoras, setDatosJugadoras] = useState([]);
  const [formData, setFormData] = useState({
    identrenamiento: identrenamiento,
    idjugadora: null,
    estado: tipoconfirmacion === "true"
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      estado: tipoconfirmacion === "true",
    }));

    async function getAllJugadoraNoConfirmadasByEntrenamiento() {
      let response = await fetch(
        apiUrl +
          "/entrenamientos/tipo/jugadoras/noconfirmadas/" +
          identrenamiento,
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
        setDatosJugadoras(data.datos);
      }
    }

    getAllJugadoraNoConfirmadasByEntrenamiento();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { idjugadora, identrenamiento, estado } = formData;

    if (tipoconfirmacion == true) {
      estado = true;
    }

    if (!idjugadora) {
      alert("Selecciona una jugadora");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/entrenamientos/tipo/${identrenamiento}/${idjugadora}/${estado}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        navigate(`/home/training/mostrar-entrenamiento/${identrenamiento}`);
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Asegúrate de convertir el valor a número si es necesario
    setFormData((prev) => ({
      ...prev,
      [name]: name === "idjugadora" ? Number(value) : value,
    }));
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />

        {formData.estado ? (
          <Typography sx={{ marginBottom: 2 }}>Crear asistencia</Typography>
        ) : (
          <Typography sx={{ marginBottom: 2 }}>Crear no asistencia</Typography>
        )}

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Select
            labelId="select-jugadora-label"
            id="select-jugadora"
            value={formData.idjugadora}
            label="Jugadora"
            onChange={handleChange}
            name="idjugadora"
          >
            {datosJugadoras.map((jugadora) => (
              <MenuItem key={jugadora.idjugadora} value={jugadora.idjugadora}>
                {jugadora.nombre}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" type="submit">
            Guardar asistencia
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateVerification;
