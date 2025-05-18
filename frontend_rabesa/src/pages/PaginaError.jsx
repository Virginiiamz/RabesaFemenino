import Menu from "../components/Menu";
import { Box, Button, Toolbar, Typography } from "@mui/material";

/**
 * Componente de página de error.
 * Muestra un mensaje de error y un botón para volver a la página principal.
 * @returns {JSX.Element} - Componente de página de error.
 */
function PaginaError() {
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
      </Box>
      <Menu />
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        No hemos encontrado la página que buscas
      </Typography>
      <Box textAlign={"center"} sx={{ mt: 2 }}>
        <Button variant="contained" align="center" href="/" sx={{ mt: 2 }}>
          Ir a la página princial
        </Button>
      </Box>
    </>
  );
}

export default PaginaError;
