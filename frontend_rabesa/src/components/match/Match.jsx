import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../../config";
import useUserStore from "../../stores/useUserStore";
import { Link, useNavigate } from "react-router";
import { Icon } from "@iconify-icon/react";
import { useSnackbar } from "notistack";
import { playNotificationSound } from "../../utils/Funciones";
import { TbSoccerField } from "react-icons/tb";
import logoRabesa from "../../assets/img/logo_rabesa.jpg";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Match() {
  const [datosPartidos, setDatosPartidos] = useState([]);
  const [club, setClub] = useState([]);
  const [resultadoVacio, setResultadoVacio] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const notificacion = useRef(null);

  const { user } = useUserStore();
  let entrenador = false;

  if (user.rol == "Entrenador") {
    entrenador = true;
  }

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

  const formatHora = (horaString) => {
    // Verifica si la hora existe y es un string
    if (!horaString || typeof horaString !== "string") return "--:--"; // Valor por defecto

    try {
      const [hora, minuto] = horaString.split(":");
      return `${hora}:${minuto}`; // Formato 24h (ejemplo: "12:00")
    } catch (error) {
      console.error("Error al formatear la hora:", error);
      return "--:--"; // Fallback seguro
    }
  };

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

      playNotificationSound(notificacion);

      enqueueSnackbar("Partido borrado correctamente", {
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
            <iconify-icon
              icon="famicons:football-sharp"
              width="26"
              height="26"
            ></iconify-icon>
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
              Partidos
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {entrenador ? (
              <Link to="/home/crear-partido">
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
                    padding: "0.2rem",
                  }}
                >
                  <Tooltip title="Crear partido">
                    <TbSoccerField style={{ fontSize: "30px" }} />
                  </Tooltip>
                </Button>
              </Link>
            ) : null}
          </Box>
        </div>

        <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {datosPartidos.map((partido) => (
            <>
              <Box
                sx={{
                  border: "1px solid #BDBDBD",
                  borderRadius: "4px",
                  backgroundColor: "#FFFFFF",
                  padding: "1.5rem 1rem",
                }}
              >
                <section
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: { xs: "20%", md: "22%" },
                    }}
                  >
                    <Box
                      component="img"
                      src={logoRabesa}
                      sx={{
                        height: { xs: "60px", lg: "90px" },
                        width: { xs: "50px", lg: "80px" },
                      }}
                      alt="Escudo Rabesa"
                    />
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", lg: "20px" },
                        fontFamily: "Open Sans",
                      }}
                      gutterBottom
                    >
                      Rabesa
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      width: "8%",
                      textAlign: { xs: "center", md: "left" },
                      fontSize: { xs: "20px", lg: "28px" },
                      fontWeight: 600,
                      fontFamily: "Open Sans",
                      color: "#3d64a8",
                    }}
                    gutterBottom
                  >
                    {partido.resultado.split("-")[0]}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: 0,
                      width: { md: "30%" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "12px", lg: "16px" },
                        fontFamily: "Open Sans",
                        fontWeight: 600,
                        color: "#3d64a8",
                      }}
                    >
                      {formatearFecha(partido.fecha_partido)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "12px", lg: "16px" },
                        fontFamily: "Open Sans",
                        fontWeight: 600,
                        color: "#3d64a8",
                      }}
                    >
                      {partido.ubicacion}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "12px", lg: "16px" },
                        fontFamily: "Open Sans",
                        fontWeight: 600,
                        color: "#3d64a8",
                      }}
                    >
                      {formatHora(partido?.hora)} h
                    </Typography>

                    {entrenador && (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                            marginTop: 1,
                          }}
                        >
                          {/* Mostrar "Añadir resultado" SOLO si el resultado está vacío */}
                          {partido.resultado === "" &&
                            new Date(partido.fecha_partido) < new Date() && (
                              <Box
                                onClick={() =>
                                  navigate(
                                    "/home/partido/anadir-resultado/" +
                                      partido.idpartido
                                  )
                                }
                                sx={{ cursor: "pointer", color: "#00338e" }}
                              >
                                <Tooltip title="Añadir resultado">
                                  <iconify-icon
                                    icon="material-symbols:scoreboard-rounded"
                                    width="28"
                                    height="28"
                                  ></iconify-icon>
                                </Tooltip>
                              </Box>
                            )}
                          <Box
                            onClick={() =>
                              navigate(
                                "/home/modificar-partido/" + partido.idpartido
                              )
                            }
                            sx={{ cursor: "pointer", color: "#00338e" }}
                          >
                            <Tooltip title="Editar partido">
                              <EditIcon></EditIcon>
                            </Tooltip>
                          </Box>
                          <Box
                            onClick={() => handleDelete(partido.idpartido)}
                            sx={{ cursor: "pointer", color: "#00338e" }}
                          >
                            <Tooltip title="Eliminar partido">
                              <DeleteIcon></DeleteIcon>
                            </Tooltip>
                          </Box>
                        </Box>
                      </>
                    )}
                  </div>
                  <Typography
                    sx={{
                      width: "8%",
                      textAlign: { xs: "center", md: "right" },
                      fontSize: { xs: "20px", lg: "28px" },
                      fontWeight: 600,
                      fontFamily: "Open Sans",
                      color: "#3d64a8",
                    }}
                    gutterBottom
                  >
                    {partido.resultado.split("-")[1]}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: { xs: "20%", md: "28%" },
                    }}
                  >
                    <Box
                      component="img"
                      src={`http://localhost:3000/uploads/${partido.idrival_club?.imagen}`}
                      sx={{
                        height: { xs: "50px", lg: "90px" },
                        width: { xs: "50px", lg: "90px" },
                      }}
                      alt="Escudo del rival"
                    />
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", lg: "20px" },
                        fontFamily: "Open Sans",
                        textAlign: "center",
                      }}
                      gutterBottom
                    >
                      {partido.idrival_club?.nombre}
                    </Typography>
                  </Box>
                </section>
              </Box>
            </>
          ))}
        </Box>
      </Box>
    </>
  );
}

//  <Card>
//               <CardContent>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "row",
//                     gap: 4,
//                     justifyContent: "space-around",
//                     alignItems: "center",
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

//                   <Typography>{partido.resultado.split("-")[0]}</Typography>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "text.secondary" }}
//                     >
//                       {partido.fecha_partido}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "text.secondary" }}
//                     >
//                       {partido.hora}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "text.secondary" }}
//                     >
//                       {partido.ubicacion}
//                     </Typography>
//                   </Box>
//                   <Typography>{partido.resultado.split("-")[1]}</Typography>
//                   <img
//                     src={`http://localhost:3000/uploads/${partido.idrival_club.imagen}`}
//                     style={{
//                       height: "100px",
//                       width: "100px",
//                       margin: "1rem",
//                     }}
//                   ></img>
//                 </Box>
//               </CardContent>
//               <CardActions>
//                 {entrenador && (
//                   <>
//                     {/* Mostrar "Añadir resultado" SOLO si el resultado está vacío */}
//                     {partido.resultado === "" && (
//                       <Button
//                         size="small"
//                         onClick={() =>
//                           navigate(
//                             "/home/partido/anadir-resultado/" +
//                               partido.idpartido
//                           )
//                         }
//                       >
//                         Añadir resultado
//                       </Button>
//                     )}
//                     <Button
//                       size="small"
//                       onClick={() =>
//                         navigate("/home/modificar-partido/" + partido.idpartido)
//                       }
//                     >
//                       Editar
//                     </Button>
//                     <Button
//                       size="small"
//                       onClick={() => handleDelete(partido.idpartido)}
//                     >
//                       Eliminar
//                     </Button>
//                   </>
//                 )}
//               </CardActions>
//             </Card>

export default Match;
