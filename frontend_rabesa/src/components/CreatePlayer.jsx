import { Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function CreatePlayer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    nombre: "",
    edad: 0,
    posicion: "",
    numero_camiseta: 0,
    fecha_ingreso: new Date(),
    estado: "",
    imagen: "",
    idclub: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl + "/jugadoras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        navigate("/home/team"); // Redirige tras el login exitoso
      } else {
        alert(data.mensaje);
        // setErrors({ apiError: data.mensaje || "Credenciales incorrectas." });
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        <Typography sx={{ marginBottom: 2 }}>Crear jugadora</Typography>
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
            label="Correo"
            variant="outlined"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Contraseña"
            variant="outlined"
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
          />
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
            label="Posicion"
            variant="outlined"
            type="text"
            name="posicion"
            value={formData.posicion}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Numero camiseta"
            variant="outlined"
            type="number"
            name="numero_camiseta"
            value={formData.numero_camiseta}
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
          <TextField
            id="outlined-basic"
            label="Estado"
            variant="outlined"
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Imagen"
            variant="outlined"
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
          />
          <Button variant="outlined" type="submit">
            Crear jugadora
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreatePlayer;
