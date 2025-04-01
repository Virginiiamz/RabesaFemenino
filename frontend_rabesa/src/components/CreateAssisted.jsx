import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiUrl } from "../config";

function CreateAssited() {
  const { identrenamiento } = useParams();
  const [datosJugadoras, setDatosJugadoras] = useState([]);
  const [selectedJugadora, setSelectedJugadora] = useState("");

  useEffect(() => {
    async function getAllJugadoras() {
      let response = await fetch(apiUrl + "/jugadoras", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setDatosJugadoras(data.datos);
      }
    }

    getAllJugadoras();
  }, []);

  const handleChange = (event) => {
    setSelectedJugadora(event.target.value);
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

        <Typography sx={{ marginBottom: 2 }}>Crear asistencia</Typography>

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
          //   onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <FormControl fullWidth>
            <InputLabel id="select-jugadora-label">
              Selecciona una jugadora
            </InputLabel>
            <Select
              labelId="select-jugadora-label"
              id="select-jugadora"
              value={selectedJugadora}
              label="Jugadora"
              onChange={handleChange}
            >
              {datosJugadoras.map((jugadora) => (
                <MenuItem value={jugadora.idjugadora}>
                  {jugadora.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" type="submit">
            Guardar asistencia
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateAssited;
