import { Outlet, useNavigate } from "react-router";
import Menu from "./Menu";
import { Box } from "@mui/material";
import useUserStore from "../stores/useUserStore";

function Home() {
  const hasHydrated = useUserStore.persist.hasHydrated();

  // Mientras no sepamos el estado real del store, mostramos un loader
  if (!hasHydrated) {
    return <div>Cargando sesión…</div>;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Menu /> {/* Menú lateral */}
      <Box
        component="main"
        sx={{
          width: "100%", // Ocupa todo el ancho
          marginLeft: 0, // Elimina el margen izquierdo
          backgroundColor: "#F1F8FF",
          minHeight: "100vh",
        }}
      >
        <Outlet /> {/* Contenido principal */}
      </Box>
    </Box>
  );
}

export default Home;
