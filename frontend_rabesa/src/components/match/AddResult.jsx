import { Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../../config";

function AddResult() {
  const params = useParams();
  const [formData, setFormData] = useState({
    resultado: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl + "/partidos/anadir-resultado/" + params.idpartido, {
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
        alert("Añadido resultado correctamente.");
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
        <Typography sx={{ marginBottom: 2 }}>Añadir resultado</Typography>

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
            label="Resultado del partido"
            variant="outlined"
            name="resultado"
            value={formData.resultado}
            type="text"
            onChange={handleChange}
          />
          <Button variant="outlined" type="submit">
            Añadir resultado
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default AddResult;
