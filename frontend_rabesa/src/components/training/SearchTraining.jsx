import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../../config";
import useUserStore from "../../stores/useUserStore";

function SearchTraining() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fechadesde: new Date(),
    fechahasta: new Date(),
  });
  const [datosEntrenamientos, setDatosEntrenamientos] = useState([]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const opciones = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    let fechaStr = new Date(fecha).toLocaleDateString("es-ES", opciones);

    fechaStr = fechaStr.replace(/\b\w/g, (letra, indice) => {
      if (indice === 0 || fechaStr.substring(indice - 3, indice) === "de ") {
        return letra.toUpperCase();
      }
      return letra;
    });

    return fechaStr;
  };

  const { user } = useUserStore();
  let entrenador = false;

  if (user.rol == "Entrenador") {
    entrenador = true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        apiUrl +
          "/entrenamientos/buscar/" +
          formData.fechadesde +
          "/" +
          formData.fechahasta +
          "/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        let data = await response.json();
        setDatosEntrenamientos(data.datos);
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (identrenamiento) => {
    let response = await fetch(apiUrl + "/entrenamientos/" + identrenamiento, {
      method: "DELETE",
    });

    if (response.ok) {
      const entrenamientoTrasBorrado = datosEntrenamientos.filter(
        (entrenamiento) => entrenamiento.identrenamiento != identrenamiento
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatosEntrenamientos(entrenamientoTrasBorrado);
    }
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

        <Typography sx={{ marginBottom: 2 }}>Buscar entrenamiento</Typography>

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
            label="Fecha desde"
            variant="outlined"
            name="fechadesde"
            value={formData.fechadesde}
            type="date"
            onChange={handleChange}
          />

          <TextField
            id="outlined-basic"
            label="Fecha hasta"
            variant="outlined"
            name="fechahasta"
            value={formData.fechahasta}
            type="date"
            onChange={handleChange}
          />

          <Button variant="outlined" type="submit">
            Buscar
          </Button>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {datosEntrenamientos.map((entrenamiento) => (
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Entrenamiento
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {formatearFecha(entrenamiento.fecha_entrenamiento)}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entrenamiento.hora_inicio} - {entrenamiento.hora_final}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entrenamiento.tipo}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {entrenamiento.informacion}
                </Typography>
              </CardContent>
              <CardActions>
                {entrenador ? (
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(
                        "/home/training/mostrar-entrenamiento/" +
                          entrenamiento.identrenamiento
                      )
                    }
                  >
                    Ver informacion
                  </Button>
                ) : null}

                {entrenador ? (
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(
                        "/home/modificar-entrenamiento/" +
                          entrenamiento.identrenamiento
                      )
                    }
                  >
                    Editar
                  </Button>
                ) : null}
                {entrenador ? (
                  <Button
                    size="small"
                    onClick={() => handleDelete(entrenamiento.identrenamiento)}
                  >
                    Eliminar
                  </Button>
                ) : null}
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default SearchTraining;
