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
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";

function ModifyMatch() {
  const params = useParams();
  const [datosClubs, setDatosClubs] = useState([]);
  const [formData, setFormData] = useState({
    idrival: null,
    ubicacion: "",
    resultado: "",
    fecha_partido: new Date().toISOString().split("T")[0],
    hora: "00:00", // Sin segundos
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function getPartidoById() {
      let response = await fetch(apiUrl + "/partidos/" + params.idpartido);
      if (response.ok) {
        let data = await response.json();
        setFormData(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/home/partidos");
      }
    }

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
    getPartidoById();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl + "/partidos/" + params.idpartido, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.status === 400) {
        let errorData = await response.json();
        alert("Error: " + errorData.mensaje);
      }

      if (response.status == 204) {
        alert("Partido modificado correctamente.");
        navigate("/home/partidos");
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Si es una hora, aseguramos formato HH:mm:ss
    if (name === "hora") {
      formattedValue = value.length === 5 ? value + ":00" : value; // Si es HH:mm, añadimos ":00"
    }

    setFormData({ ...formData, [name]: formattedValue });
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
        <Typography sx={{ marginBottom: 2 }}>Modificar partido</Typography>

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
            Modificar partido
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default ModifyMatch;
