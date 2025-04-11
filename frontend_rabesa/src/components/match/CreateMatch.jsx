import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../../config";

function CreateMatch() {
  const [datosClubs, setDatosClubs] = useState([]);
  const [formData, setFormData] = useState({
    idrival: null,
    resultado: "",
    ubicacion: "",
    hora: 0,
    fecha_partido: new Date(),
  });
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      const response = await fetch(apiUrl + "/partidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        navigate("/home/partidos");
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
      [name]: name === "idrival" ? Number(value) : value,
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
        <Typography sx={{ marginBottom: 2 }}>Crear partido</Typography>

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Select
            labelId="select-rival-label"
            id="select-rival"
            value={formData.idrival}
            label="Club"
            onChange={handleChange}
            name="idrival"
          >
            {datosClubs.map((club) => (
              <MenuItem key={club.idclub} value={club.idclub}>
                {club.nombre}
              </MenuItem>
            ))}
          </Select>
          <TextField
            id="outlined-basic"
            label="Ubicacion"
            variant="outlined"
            name="ubicacion"
            value={formData.ubicacion}
            type="text"
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Resultado"
            variant="outlined"
            name="resultado"
            value={formData.resultado}
            type="text"
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Fecha partido"
            variant="outlined"
            name="fecha_partido"
            value={formData.fecha_partido}
            type="date"
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Hora partido"
            variant="outlined"
            name="hora"
            value={formData.hora}
            type="time"
            onChange={handleChange}
          />
          <Button variant="outlined" type="submit">
            Crear partido
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateMatch;
