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
import { Link } from "react-router";

function Club() {
  const [datosClubs, setDatosClubs] = useState([]);
  const { user } = useUserStore();
  let entrenador = false;

  if (user.rol == "Entrenador") {
    entrenador = true;
  }

  useEffect(() => {
    async function getClubs() {
      let response = await fetch(apiUrl + "/clubs/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setDatosClubs(data.datos);
      }
    }

    getClubs();
  }, []);

  const handleDelete = async (idclub) => {
    let response = await fetch(apiUrl + "/clubs/" + idclub, {
      method: "DELETE",
    });

    if (response.ok) {
      const clubTrasBorrado = datosClubs.filter(
        (club) => club.idclub != idclub
      );
      setDatosClubs(clubTrasBorrado);
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
          <Link to="/home/crear-club">
            <Button variant="contained">Crear club</Button>
          </Link>
        ) : null}

        <Typography sx={{ marginBottom: 2 }}>Clubs</Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {datosClubs.map((club) => (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
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

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {club.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {club.ciudad}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {club.estadio}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {club.puntos}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {club.fecha_fundacion}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                {entrenador && (
                  <>
                    <Button
                      size="small"
                      //   onClick={() =>
                      // navigate("/home/modificar-partido/" + partido.idpartido)
                      //   }
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDelete(club.idclub)}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Club;
