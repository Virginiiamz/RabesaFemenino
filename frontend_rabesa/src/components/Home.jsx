import { Outlet } from "react-router";

/**
 * Componente de la página principal.
 * Muestra el menú y el contenido de las rutas hijas.
 * @returns {JSX.Element} - Componente de la página principal.
 */

import Menu from "./Menu";

function Home() {

  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
}

export default Home;
