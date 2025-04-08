import {
  Box,
  Button,
  TextareaAutosize,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";

function ModifyTraining() {
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    fecha_entrenamiento: new Date().toISOString().split("T")[0],
    hora_inicio: "00:00", // Sin segundos
    hora_final: "00:00", // Sin segundos
    tipo: "",
    informacion: "",
  });

  useEffect(() => {
    async function getEntrenamientoById() {
      let response = await fetch(
        apiUrl + "/entrenamientos/" + params.identrenamiento
      );
      if (response.ok) {
        let data = await response.json();
        setFormData(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/home/training"); // Volver a la página principal por ruta erronea
      }
    }

    getEntrenamientoById();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📤 Enviando datos:", formData); // 👈 DEBUG

    try {
      const response = await fetch(
        apiUrl + "/entrenamientos/" + params.identrenamiento,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 400) {
        let errorData = await response.json();
        alert("Error: " + errorData.mensaje);
      }

      if (response.status == 204) {
        alert("Entrenamiento modificado correctamente.");
        navigate("/home/training");
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Si es una hora, aseguramos formato HH:mm:ss
    if (name === "hora_inicio" || name === "hora_final") {
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
        <Typography sx={{ marginBottom: 2 }}>
          Modificar entrenamiento
        </Typography>
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
          <TextareaAutosize
            id="outlined-basic"
            variant="outlined"
            aria-label="empty textarea"
            placeholder="Descripcion"
            name="informacion"
            value={formData.informacion}
            onChange={handleChange}
          />
          <Button variant="outlined" type="submit">
            Modificar entrenamiento
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default ModifyTraining;
