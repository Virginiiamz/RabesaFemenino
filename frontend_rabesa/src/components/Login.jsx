import { Box, Button, TextField } from "@mui/material";
import { apiUrl } from "../config";
import { useNavigate } from "react-router";
import { useState } from "react";
import useUserStore from "../stores/useUserStore";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });
  const [errors, setErrors] = useState({});
  const { setUser } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl + "/usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        
        alert(data.mensaje);
        setUser(data.datos);
        navigate("/home/dashboard"); // Redirige tras el login exitoso
      } else {
        alert(data.mensaje);
        // setErrors({ apiError: data.mensaje || "Credenciales incorrectas." });
      }
    } catch (error) {
      setErrors({
        apiError: "Error de red. Inténtalo de nuevo más tarde." + error,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <h1>Login</h1>
      <Box
        component="form"
        sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          id="outlined-basic"
          label="Correo"
          variant="outlined"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic"
          label="Contraseña"
          variant="outlined"
          type="password"
          name="contrasena"
          value={formData.contrasena}
          onChange={handleChange}
        />
        <Button variant="outlined" type="submit">Iniciar sesion</Button>
      </Box>
    </>
  );
}

export default Login;
