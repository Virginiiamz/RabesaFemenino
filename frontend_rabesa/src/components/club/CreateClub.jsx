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

function CreateClub() {
  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "",
    estadio: "",
    puntos: 0,
    imagen: null,
    fecha_fundacion: new Date(),
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un objeto FormData
    const formDataToSend = new FormData();

    // Agregar los campos al FormData
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("ciudad", formData.ciudad);
    formDataToSend.append("estadio", formData.estadio);
    formDataToSend.append("puntos", formData.puntos);
    formDataToSend.append("fecha_fundacion", formData.fecha_fundacion);

    // Agregar la imagen si existe
    if (formData.imagen) {
      formDataToSend.append("imagen", formData.imagen);
    }

    try {
      const response = await fetch(apiUrl + "/clubs", {
        method: "POST",
        body: formDataToSend, // Enviar el FormData
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        navigate("/home/club"); // Redirige tras el login exitoso
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Typography sx={{ marginBottom: 2 }}>Crear club</Typography>

        <Box
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
          <TextField
            id="outlined-basic"
            label="Fecha fundacion"
            variant="outlined"
            name="fecha_fundacion"
            value={formData.fecha_fundacion}
            type="date"
            onChange={handleChange}
          />
          <Button variant="outlined" type="submit">
            Crear club
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateClub;
