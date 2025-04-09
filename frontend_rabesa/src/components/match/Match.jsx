import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiUrl } from "../../config";
import useUserStore from "../../stores/useUserStore";
import { Link, useNavigate } from "react-router";

function Match() {
  const [datosPartidos, setDatosPartidos] = useState([]);
  const [club, setClub] = useState([]);
  const navigate = useNavigate();

  const { user } = useUserStore();
  let entrenador = false;

  if (user.rol == "Entrenador") {
    entrenador = true;
  }

  useEffect(() => {
    async function getPartidos() {
      let response = await fetch(apiUrl + "/partidos/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setDatosPartidos(data.datos);
      }
    }

    async function getClubById() {
      let response = await fetch(apiUrl + "/clubs/1/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setClub(data.datos);
      }
    }

    getPartidos();
    getClubById();
  }, []);

  const handleDelete = async (idpartido) => {
    let response = await fetch(apiUrl + "/partidos/" + idpartido, {
      method: "DELETE",
    });

    if (response.ok) {
      const partidoTrasBorrado = datosPartidos.filter(
        (partido) => partido.idpartido != idpartido
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatosPartidos(partidoTrasBorrado);
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

        {entrenador ? (
          <Link to="/home/crear-partido">
            <Button variant="contained">Crear partido</Button>
          </Link>
        ) : null}

        <Typography sx={{ marginBottom: 2 }}>Partidos</Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {datosPartidos.map((partido) => (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`http://localhost:3000/uploads/${club.imagen}`}
                    style={{
                      height: "100px",
                      width: "100px",
                      margin: "1rem",
                    }}
                  ></img>

                  <Typography>{partido.resultado.split("-")[0]}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {partido.fecha_partido}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {partido.hora}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {partido.ubicacion}
                    </Typography>
                  </Box>
                  <Typography>{partido.resultado.split("-")[1]}</Typography>
                  <img
                    src={`http://localhost:3000/uploads/${partido.idrival_club.imagen}`}
                    style={{
                      height: "100px",
                      width: "100px",
                      margin: "1rem",
                    }}
                  ></img>
                </Box>
              </CardContent>
              <CardActions>
                {entrenador ? (
                  <Button
                    size="small"
                    onClick={() =>
                      navigate("/home/modificar-partido/" + partido.idpartido)
                    }
                  >
                    Editar
                  </Button>
                ) : null}
                {entrenador ? (
                  <Button
                    size="small"
                    onClick={() => handleDelete(partido.idpartido)}
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

export default Match;
