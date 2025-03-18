// import { Outlet } from "react-router";
// import Menu from "../components/Menu";

/**
 * Componente de la página principal.
 * Muestra el menú y el contenido de las rutas hijas.
 * @returns {JSX.Element} - Componente de la página principal.
 */
import useUserStore from "../stores/useUserStore";

function Home() {
  
  const { user } = useUserStore();

  return (
    <>
      <h1>Bienvenido {user.correo}</h1>
      {/* <Menu /> */}
      {/* <Outlet /> */}
    </>
  );
}

export default Home;
