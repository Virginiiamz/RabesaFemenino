import { Outlet } from "react-router";
import Menu from "./Menu";
import { Box } from "@mui/material";

function Home() {
  return (
    <Box sx={{ display: "flex" }}>
      <Menu /> {/* Menú lateral */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%", // Ocupa todo el ancho
          marginLeft: 0, // Elimina el margen izquierdo
        }}
      >
        <Outlet /> {/* Contenido principal */}
      </Box>
    </Box>
  );
}

export default Home;
