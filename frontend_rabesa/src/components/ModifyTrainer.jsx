import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";
import { Box, Button, TextField, Toolbar, Typography } from "@mui/material";

function ModifyTrainer() {
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    // identrenador: params.identrenador,
    // correo: "",
    // contrasena: "",
    nombre: "",
    edad: 0,
    rol: "",
    fecha_ingreso: new Date(),
    // imagen: "",
    idclub: 1,
    // idusuario: 0,
  });

  useEffect(() => {
    async function getEntrenadorById() {
      let response = await fetch(
        apiUrl + "/entrenadores/" + params.identrenador
      );
      if (response.ok) {
        let data = await response.json();
        setFormData(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/home/team"); // Volver a la página principal por ruta erronea
      }
    }

    getEntrenadorById();
  }, []); // Se ejecuta solo en el primer renderizado

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        apiUrl + "/entrenadores/" + params.identrenador,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
          body: JSON.stringify(formData),
        }
      );

      if (response.status == 204) {
        alert("Entrenador modificado correctamente.");
        navigate("/home/team");
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        <Typography sx={{ marginBottom: 2 }}>Modificar entrenador</Typography>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* <TextField
            id="outlined-basic"
            label="identrenador"
            variant="outlined"
            type="number"
            name="identrenador"
            value={formData.identrenador}
            onChange={handleChange}
          /> */}
          <TextField
            id="outlined-basic"
            label="Nombre"
            variant="outlined"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Edad"
            variant="outlined"
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Rol"
            variant="outlined"
            type="text"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Fecha ingreso"
            variant="outlined"
            type="date"
            name="fecha_ingreso"
            value={formData.fecha_ingreso}
            onChange={handleChange}
          />
          <Button variant="outlined" type="submit">
            Crear entrenador
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default ModifyTrainer;
