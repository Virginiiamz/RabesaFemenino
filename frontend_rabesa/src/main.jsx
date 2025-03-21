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
import CreatePlayer from "./components/CreatePlayer";
import ModifyPlayer from "./components/ModifyPlayer";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

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
        element: <Dashboard />,
      },
      {
        path: "team",
        element: (
          <ProtectedRoute
            element={<Team />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
      },
      {
        path: "/home/crear-entrenador",
        element: (
          <ProtectedRoute
            element={<CreateTrainer />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
        // element: <CreateTrainer />,
      },
      {
        path: "/home/modificar-entrenador/:identrenador",
        element: (
          <ProtectedRoute
            element={<ModifyTrainer />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
        // element: <ModifyTrainer />,
      },
      {
        path: "/home/crear-jugadora",
        element: (
          <ProtectedRoute
            element={<CreatePlayer />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
        // element: <CreatePlayer />,
      },
      {
        path: "/home/modificar-jugadora/:idjugadora",
        element: (
          <ProtectedRoute
            element={<ModifyPlayer />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
        // element: <ModifyPlayer />,
      },
    ],
  },
  {
    path: "unauthorized",
    element: <Unauthorized />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
