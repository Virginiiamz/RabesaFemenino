import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Team from "./components/Team";
import CreateTrainer from "./components/CreateTrainer";
import ModifyTrainer from "./components/ModifyTrainer";
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
    {
      path: "team",
      element: <Team />
    },
    {
      path: "/home/crear-entrenador",
      element: <CreateTrainer />
    },
    {
      path: "/home/modificar-entrenador/:identrenador",
      element: <ModifyTrainer />
    },
  ],
  },
  
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
