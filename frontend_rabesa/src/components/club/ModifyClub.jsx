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

function ModifyClub() {
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "",
    estadio: "",
    imagen: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (response.status === 400) {
        let errorData = await response.json();
        alert("Error: " + errorData.mensaje);
      }

      if (response.status == 204) {
        alert("Club modificado correctamente.");
        navigate("/home/club");
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
        <Typography sx={{ marginBottom: 2 }}>Modificar club</Typography>

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
          <Button variant="outlined" type="submit">
            Modificar club
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default ModifyClub;
