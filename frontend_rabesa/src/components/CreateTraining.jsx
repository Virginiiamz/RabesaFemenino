import { Box, Button, TextareaAutosize, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function CreateTraining() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fecha_entrenamiento: new Date(),
    hora_inicio: 0,
    hora_final: 0,
    tipo: "",
    informacion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl + "/entrenamientos", {
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
        navigate("/home/training");
      } else {
        alert(data.mensaje);
        // setErrors({ apiError: data.mensaje || "Credenciales incorrectas." });
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formDataToSend = new FormData();
  //   formDataToSend.append("correo", formData.correo);
  //   formDataToSend.append("contrasena", formData.contrasena);
  //   formDataToSend.append("nombre", formData.nombre);
  //   formDataToSend.append("edad", formData.edad);
  //   formDataToSend.append("rol", formData.rol);
  //   formDataToSend.append("fecha_ingreso", formData.fecha_ingreso);
  //   formDataToSend.append("idclub", formData.idclub);
  //   if (formData.imagen) {
  //     formDataToSend.append("imagen", formData.imagen); // Agrega la imagen
  //   }

  //   try {
  //     const response = await fetch(apiUrl + "/entrenadores", {
  //       method: "POST",
  //       body: formDataToSend, // Enviamos FormData en lugar de JSON
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert(data.mensaje);
  //       navigate("/home/team");
  //     } else {
  //       alert(data.mensaje);
  //     }
  //   } catch (error) {
  //     alert("Error de red. Inténtalo de nuevo más tarde.");
  //   }
  // };

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
        <Typography sx={{ marginBottom: 2 }}>Crear entrenamiento</Typography>
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
            label="Fecha de entrenamiento"
            variant="outlined"
            name="fecha_entrenamiento"
            value={formData.fecha_entrenamiento}
            type="date"
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Hora inicio"
            variant="outlined"
            type="time"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Hora final"
            variant="outlined"
            type="time"
            name="hora_final"
            value={formData.hora_final}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="Tipo entrenamiento"
            variant="outlined"
            type="text"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
          />
          <TextareaAutosize id="outlined-basic" variant="outlined" aria-label="empty textarea" placeholder="Descripcion" name="informacion" onChange={handleChange} />
          <Button variant="outlined" type="submit">
            Crear entrenamiento
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateTraining;
