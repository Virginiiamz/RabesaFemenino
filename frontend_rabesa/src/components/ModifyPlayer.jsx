import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";
import { Box, Button, TextField, Toolbar, Typography } from "@mui/material";

function ModifyPlayer() {
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    nombre: "",
    edad: 0,
    posicion: "",
    numero_camiseta: 0,
    estado: "",
    idclub: 1,
  });

  useEffect(() => {
    async function getJugadoraById() {
      let response = await fetch(apiUrl + "/jugadoras/" + params.idjugadora);
      if (response.ok) {
        let data = await response.json();
        setFormData(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/home/team"); // Volver a la página principal por ruta erronea
      }
    }

    getJugadoraById();
  }, []); // Se ejecuta solo en el primer renderizado

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl + "/jugadoras/" + params.idjugadora, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
        body: JSON.stringify(formData),
      });

      if (response.status == 204) {
        alert("Jugadora modificada correctamente.");
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
        <Typography sx={{ marginBottom: 2 }}>Modificar jugadora</Typography>
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
            label="Estado"
            variant="outlined"
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          />
          <Button variant="outlined" type="submit">
            Modificar jugadora
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default ModifyPlayer;
