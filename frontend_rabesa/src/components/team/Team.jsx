import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../config";
import useUserStore from "../../stores/useUserStore";
import ShieldIcon from "@mui/icons-material/Shield";
import Face3Icon from "@mui/icons-material/Face3";
import SportsIcon from "@mui/icons-material/Sports";
import { Icon } from "@iconify-icon/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Team() {
  const [datosEntrenadores, setDatosEntrenadores] = useState([]);
  const [datosJugadoras, setDatosJugadoras] = useState([]);
  const navigate = useNavigate();

  const { user } = useUserStore();
  let esEntrenador = false;

  if (user.rol == "Entrenador") {
    esEntrenador = true;
  }

  useEffect(() => {
    async function getEntrenadores() {
      let response = await fetch(apiUrl + "/entrenadores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
      });

      if (response.ok) {
        let data = await response.json();
        setDatosEntrenadores(data.datos);
      }
    }

    async function getJugadoras() {
      let response = await fetch(apiUrl + "/jugadoras", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
      });

      if (response.ok) {
        let data = await response.json();
        setDatosJugadoras(data.datos);
      }
    }

    getEntrenadores();
    getJugadoras();
  }, []); // Se ejecuta solo en el primer renderizado

  const handleDeleteEntrenadores = async (identrenador) => {
    let response = await fetch(apiUrl + "/entrenadores/" + identrenador, {
      method: "DELETE",
    });

    if (response.ok) {
      const entrenadoresTrasBorrado = datosEntrenadores.filter(
        (entrenador) => entrenador.identrenador != identrenador
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatosEntrenadores(entrenadoresTrasBorrado);
    }
  };

  const handleDeleteJugadoras = async (idjugadora) => {
    let response = await fetch(apiUrl + "/jugadoras/" + idjugadora, {
      method: "DELETE",
    });

    if (response.ok) {
      const jugadorasTrasBorrado = datosJugadoras.filter(
        (jugadora) => jugadora.idjugadora != idjugadora
      );
      // Establece los datos de nuevo para provocar un renderizado
      setDatosJugadoras(jugadorasTrasBorrado);
    }
  };

  function CrearJugadoraIcono() {
    return (
      <div>
        <FaUserPlus size={30} style={{ marginRight: "8px" }} />
        <FaFutbol size={30} />
      </div>
    );
  }

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShieldIcon sx={{ fontSize: 26, color: "#00338e" }} />
            <Typography
              sx={{
                fontFamily: "'Open Sans'",
                fontSize: "20px",
                fontWeight: 600,
                color: "#00338e",
                padding: 0,
                margin: 0,
              }}
            >
              Equipo
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {esEntrenador ? (
              <Link to="/home/crear-entrenador">
                <Button
                  sx={{
                    gap: 0.5,
                    color: "white",
                    backgroundColor: "#00338e",
                    fontFamily: "'Open sans'",
                    fontSize: "14px",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#AACBFF",
                      color: "#00338e",
                    },
                  }}
                >
                  <Tooltip title="Crear entrenador">
                    <iconify-icon
                      icon="mdi:whistle"
                      width="24"
                      height="24"
                    ></iconify-icon>
                  </Tooltip>
                </Button>
              </Link>
            ) : null}
            {esEntrenador ? (
              <Link to="/home/crear-jugadora">
                <Button
                  sx={{
                    gap: 0.5,
                    color: "white",
                    backgroundColor: "#00338e",
                    fontFamily: "'Open sans'",
                    fontSize: "14px",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#AACBFF",
                      color: "#00338e",
                    },
                  }}
                >
                  <Tooltip title="Crear jugadora">
                    <iconify-icon
                      icon="fa-solid:tshirt"
                      width="24"
                      height="24"
                    ></iconify-icon>
                  </Tooltip>
                </Button>
              </Link>
            ) : null}
          </Box>
        </div>

        <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />
        <Typography
          sx={{
            fontSize: "18px",
            color: "#00338e",
            fontWeight: 600,
            fontFamily: "'Open sans'",
          }}
        >
          Entrenadores
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(3, 1fr)" },
            gap: 2,
            justifyContent: "center",
            width: "100%",
            marginY: 2,
          }}
        >
          {datosEntrenadores.map((entrenador) => (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <CardMedia
                      component="img"
                      sx={{
                        borderRadius: "100%",
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      alt={entrenador.nombre}
                      image={`http://localhost:3000/uploads/${entrenador.imagen}`}
                    />
                    <Box sx={{}}>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                      >
                        {entrenador.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {entrenador.rol}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    {esEntrenador ? (
                      <>
                        <Box
                          onClick={() =>
                            navigate(
                              "/home/modificar-entrenador/" +
                                entrenador.identrenador
                            )
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <EditIcon
                            sx={{
                              color: "#00338e",
                              fontSize: { xs: "24px", md: "28px" },
                            }}
                          ></EditIcon>
                        </Box>
                        <Box
                          onClick={() =>
                            handleDeleteEntrenadores(entrenador.identrenador)
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <DeleteIcon
                            sx={{
                              color: "#00338e",
                              fontSize: { xs: "24px", md: "28px" },
                            }}
                          ></DeleteIcon>
                        </Box>
                      </>
                    ) : null}
                  </Box>
                </Box>
                <Box
                  sx={{
                    margin: 1,
                    display: "flex",
                    gap: 4,
                    alignItems: "start",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#3d64a8",
                        fontFamily: "'Open sans'",
                        fontWeight: 600,
                      }}
                      variant="subtitle2"
                    >
                      Edad
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {entrenador.edad}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#3d64a8",
                        fontFamily: "'Open sans'",
                        fontWeight: 600,
                      }}
                      variant="subtitle2"
                    >
                      Fecha ingreso
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {new Date(entrenador.fecha_ingreso).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Typography
          sx={{
            fontSize: "18px",
            marginY: 1,
            color: "#00338e",
            fontWeight: 600,
            fontFamily: "'Open sans'",
          }}
        >
          Jugadoras
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {datosJugadoras.map((jugadora) => (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <CardMedia
                      component="img"
                      sx={{
                        borderRadius: "100%",
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      alt={jugadora.nombre}
                      image={`http://localhost:3000/uploads/${jugadora.imagen}`}
                    />
                    <Box sx={{}}>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                      >
                        {jugadora.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {jugadora.posicion}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    {esEntrenador ? (
                      <>
                        <Box
                          onClick={() =>
                            navigate(
                              "/home/modificar-jugadora/" + jugadora.idjugadora
                            )
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <EditIcon
                            sx={{
                              color: "#00338e",
                              fontSize: { xs: "24px", md: "28px" },
                            }}
                          ></EditIcon>
                        </Box>
                        <Box
                          onClick={() =>
                            handleDeleteJugadoras(jugadora.idjugadora)
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <DeleteIcon
                            sx={{
                              color: "#00338e",
                              fontSize: { xs: "24px", md: "28px" },
                            }}
                          ></DeleteIcon>
                        </Box>
                      </>
                    ) : null}
                  </Box>
                </Box>
                <Box
                  sx={{
                    margin: 1,
                    display: "flex",
                    gap: 4,
                    alignItems: "start",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#3d64a8",
                        fontFamily: "'Open sans'",
                        fontWeight: 600,
                      }}
                      variant="subtitle2"
                    >
                      Edad
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {jugadora.edad}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#3d64a8",
                        fontFamily: "'Open sans'",
                        fontWeight: 600,
                      }}
                      variant="subtitle2"
                    >
                      Dorsal
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {jugadora.numero_camiseta}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#3d64a8",
                        fontFamily: "'Open sans'",
                        fontWeight: 600,
                      }}
                      variant="subtitle2"
                    >
                      Estado
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {jugadora.estado}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Team;
