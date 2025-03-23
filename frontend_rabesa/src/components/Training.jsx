import { Box, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";

function Training() {
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
        <Link to="/home/crear-entrenamiento">
          <Button variant="contained">Crear entrenamiento</Button>
        </Link>
        <Typography sx={{ marginBottom: 2 }}>Entrenamientos</Typography>
      </Box>
    </>
  );
}

export default Training;
