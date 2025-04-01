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
import { Link, useNavigate } from "react-router";
import { apiUrl } from "../config";
import useUserStore from "../stores/useUserStore";

function Training() {
  const [datosEntrenamientos, setDatosEntrenamientos] = useState([]);
  const [datosJugadora, setDatosJugadora] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    async function getEntrenamientosEntrenador() {
      let response = await fetch(apiUrl + "/entrenamientos/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setDatosEntrenamientos(data.datos);
      }
    }

    async function getDatosJugadora() {
      if (entrenador) {
        await getEntrenamientosEntrenador();
      } else {
        const jugadoraResponse = await fetch(
          apiUrl + "/jugadoras/correo/" + user.correo,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (jugadoraResponse.ok) {
          const jugadoraData = await jugadoraResponse.json();
          setDatosJugadora(jugadoraData.datos);

          const entrenamientosResponse = await fetch(
            apiUrl +
              "/entrenamientos/tipo/noconfirmados/" +
              jugadoraData.datos.idjugadora,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (entrenamientosResponse.ok) {
            const entrenamientosData = await entrenamientosResponse.json();
            setDatosEntrenamientos(entrenamientosData.datos);
          }
        }
      }
    }

    getDatosJugadora();
  }, []);

  const handleSubmitAsistencia = async (
    identrenamiento,
    idjugadora,
    estado
  ) => {
    console.log(identrenamiento);
    console.log(idjugadora);
    console.log(estado);

    try {
      const response = await fetch(
        apiUrl +
          "/entrenamientos/tipo/" +
          identrenamiento +
          "/" +
          idjugadora +
          "/" +
          estado,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        navigate(0);
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  // const handleSubmitNoAsistencia = async (identrenamiento, idjugadora) => {
  //   console.log(identrenamiento);
  //   console.log(idjugadora);

  //   try {
  //     const response = await fetch(
  //       apiUrl +
  //         "/entrenamientos/no-asistencias/" +
  //         identrenamiento +
  //         "/" +
  //         idjugadora,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert(data.mensaje);
  //       navigate(0);
  //     } else {
  //       alert(data.mensaje);
  //     }
  //   } catch (error) {
  //     alert("Error de red. Inténtalo de nuevo más tarde.");
  //   }
  // };

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
        {entrenador ? (
          <Link to="/home/crear-entrenamiento">
            <Button variant="contained">Crear entrenamiento</Button>
          </Link>
        ) : (
          <Link to="/home/training/asistidos">
            <Button variant="contained">Entrenamientos confirmados</Button>
          </Link>
        )}

        {entrenador ? null : (
          <Link to="/home/training/no-asistidos">
            <Button variant="contained">Entrenamientos no asistidos</Button>
          </Link>
        )}

        {entrenador ? (
          <Typography sx={{ marginBottom: 2 }}>Entrenamientos</Typography>
        ) : (
          <Typography sx={{ marginBottom: 2 }}>
            Entrenamientos no confirmados
          </Typography>
        )}

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
                ) : (
                  <Button
                    size="small"
                    onClick={() =>
                      handleSubmitAsistencia(
                        entrenamiento.identrenamiento,
                        datosJugadora.idjugadora,
                        true
                      )
                    }
                  >
                    Aceptar
                  </Button>
                )}
                {entrenador ? (
                  <Button
                    size="small"
                    onClick={() => handleDelete(entrenamiento.identrenamiento)}
                  >
                    Eliminar
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={() =>
                      handleSubmitAsistencia(
                        entrenamiento.identrenamiento,
                        datosJugadora.idjugadora,
                        false
                      )
                    }
                  >
                    Rechazar
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Training;
