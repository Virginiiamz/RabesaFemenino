import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
// import PaginaError from "./pages/PaginaError";

let router = createBrowserRouter([
  // errorElement: <PaginaError />,
  {
    path: "/",
    element: <Login />, // Ruta principal para el login
  },
  {
    path: "/home", // Ruta independiente para la página de inicio
    element: <Home />,
    children: [
    {
      path: "dashboard",
      element: <Dashboard />
    },
  ],
  },
  
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
