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
import { apiUrl } from "../../config";
import useUserStore from "../../stores/useUserStore";
import { Link, useNavigate } from "react-router";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { playNotificationSound } from "../../utils/Funciones";

function Club() {
  const [datosClubs, setDatosClubs] = useState([]);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#00338e",
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: "26px" }}></EmojiEventsIcon>
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
              Clubs
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {entrenador ? (
              <Link to="/home/crear-club">
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
                    padding: "0.3rem",
                  }}
                >
                  <Tooltip title="Crear club">
                    <iconify-icon
                      icon="mdi:shield-plus"
                      width="25"
                      height="25"
                    ></iconify-icon>
                  </Tooltip>
                </Button>
              </Link>
            ) : null}
          </Box>
        </div>

        <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />

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
          {datosClubs.map((club) => (
            <Card
              sx={{
                width: "100%",
                border: "1px solid #BDBDBD",
                backgroundColor: "#FFFFFF",
                boxShadow: "none"
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
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                      alt={entrenador.nombre}
                      image={`http://localhost:3000/uploads/${club.imagen}`}
                    />
                    <Box sx={{}}>
                      <Typography
                        sx={{
                          color: "#3d64a8",
                          fontFamily: "'Open sans'",
                          fontWeight: 600,
                        }}
                      >
                        {club.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {club.estadio}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    {entrenador ? (
                      <>
                        <Box
                          onClick={() =>
                            navigate("/home/modificar-club/" + club.idclub)
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
                          onClick={() => handleDelete(club.idclub)}
                          sx={{ cursor: "pointer" }}
                        >
                          <DeleteIcon
                            sx={{
                              color: "#00338e",
                              fontSize: { xs: "24px", md: "28px" },
                            }}
                          />
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
                      Ciudad
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {club.ciudad}
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
                      Puntos
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {club.puntos}
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
                      Fecha fundación
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {new Date(club.fecha_fundacion).toLocaleDateString()}
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

// <Card>
//               <CardContent>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <img
//                     src={`http://localhost:3000/uploads/${club.imagen}`}
//                     style={{
//                       height: "100px",
//                       width: "100px",
//                       margin: "1rem",
//                     }}
//                   ></img>

//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     {club.nombre}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     {club.ciudad}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     {club.estadio}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     {club.puntos}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     {club.fecha_fundacion}
//                   </Typography>
//                 </Box>
//               </CardContent>
//               <CardActions>
//                 {entrenador && (
//                   <>
//                     <Button
//                       size="small"
//                       onClick={() =>
//                         navigate("/home/modificar-club/" + club.idclub)
//                       }
//                     >
//                       Editar
//                     </Button>
//                     <Button
//                       size="small"
//                       onClick={() => handleDelete(club.idclub)}
//                     >
//                       Eliminar
//                     </Button>
//                   </>
//                 )}
//               </CardActions>
//             </Card>

export default Club;
