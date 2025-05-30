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
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../../config";
import useUserStore from "../../stores/useUserStore";
import ShieldIcon from "@mui/icons-material/Shield";
import Face3Icon from "@mui/icons-material/Face3";
import SportsIcon from "@mui/icons-material/Sports";
import { Icon } from "@iconify-icon/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import { playNotificationSound } from "../../utils/Funciones";

function Team() {
  const [datosEntrenadores, setDatosEntrenadores] = useState([]);
  const [datosJugadoras, setDatosJugadoras] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);

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

      playNotificationSound(notificacion);

      enqueueSnackbar("Se ha guardado con éxito", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
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

      playNotificationSound(notificacion);

      enqueueSnackbar("Se ha guardado con éxito", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <>
      <audio ref={notificacion} src="/sonido/notificacion.mp3" preload="auto" />
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

        {datosEntrenadores.length == 0 && datosJugadoras == 0 ? (
          <Box
            sx={{
              border: "1px solid #BDBDBD",
              paddingTop: "16px",
              borderRadius: "4px",
              width: "100%",
              backgroundColor: "#FFFFFF",
              margin: "0px",
            }}
          >
            <Typography sx={{ marginBottom: "0.7rem", textAlign: "center" }}>
              No hay ningún miembro del equipo creado
            </Typography>
          </Box>
        ) : null}

        {datosEntrenadores.length != 0 ? (
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
        ) : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(auto-fit, minmax(300px, 1fr))",
            },
            gap: 2,
            justifyContent: "center",
            width: "100%",
            marginY: 2,
          }}
        >
          {datosEntrenadores.map((entrenador) => (
            <Card
              sx={{
                border: "1px solid #BDBDBD",
                backgroundColor: "#FFFFFF",
                boxShadow: "none",
              }}
            >
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
                      image={entrenador.imagen}
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
                        {user.idusuario === entrenador.idusuario ? null : (
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
                            />
                          </Box>
                        )}
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
        {datosJugadoras.length != 0 ? (
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
        ) : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
            justifyContent: "center",
            width: "100%",
            marginY: 2,
          }}
        >
          {datosJugadoras.map((jugadora) => (
            <Card
              sx={{
                border: "1px solid #BDBDBD",
                backgroundColor: "#FFFFFF",
                boxShadow: "none",
              }}
            >
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
                      image={jugadora.imagen}
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
