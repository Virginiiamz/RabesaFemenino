import { Box, Button, TextField } from "@mui/material";

function Login() {
  return (
    <>
      <h1>Login</h1>
      <Box
        component="form"
        sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="Correo" variant="outlined" />
        <TextField id="outlined-basic" label="Contraseña" variant="outlined" />
        <Button variant="outlined">Iniciar sesion</Button>
      </Box>
    </>
  );
}

export default Login;
