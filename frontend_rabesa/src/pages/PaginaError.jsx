import Menu from "../components/Menu";
import {
  Box,
  Button,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

/**
 * Componente de página de error.
 * Muestra un mensaje de error y un botón para volver a la página principal.
 * @returns {JSX.Element} - Componente de página de error.
 */
function PaginaError() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerWidth = 240; // Ajusta esto si tu Menu tiene otro ancho

  return (
    <>
      <Menu />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          marginLeft: { sm: `${drawerWidth}px` }, // respeta la barra lateral
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <WarningAmberIcon
            sx={{ fontSize: isSmall ? 50 : 70, color: "#ff9800", mb: 2 }}
          />
          <Typography variant={isSmall ? "h6" : "h5"} gutterBottom>
            No hemos encontrado la página que buscas
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Es posible que la dirección sea incorrecta o que la página ya no
            exista.
          </Typography>
          <Button
            variant="contained"
            href="/home/dashboard/"
            sx={{
              backgroundColor: "#00338e",
              color: "#ffffff",
              textTransform: "none",
              fontSize: "0.95rem",
              padding: "8px 20px",
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "#002a75",
                color: "#ffffff",
              },
            }}
          >
            Ir al inicio
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default PaginaError;
