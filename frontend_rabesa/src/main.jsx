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
import Training from "./components/Training";
import CreateTraining from "./components/CreateTraining";
import ModifyTraining from "./components/ModifyTraining";
import AssistedTraining from "./components/AssistedTraining";
import NoAssistedTraining from "./components/NoAssistedTraining";
import ShowTraining from "./components/ShowTraining";

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
        element: <Team />,
      },
      {
        path: "/home/crear-entrenador",
        element: (
          <ProtectedRoute
            element={<CreateTrainer />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
      },
      {
        path: "/home/modificar-entrenador/:identrenador",
        element: (
          <ProtectedRoute
            element={<ModifyTrainer />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
      },
      {
        path: "/home/crear-jugadora",
        element: (
          <ProtectedRoute
            element={<CreatePlayer />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
      },
      {
        path: "/home/modificar-jugadora/:idjugadora",
        element: (
          <ProtectedRoute
            element={<ModifyPlayer />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
      },
      {
        path: "training",
        element: <Training />,
      },
      {
        path: "/home/training/asistidos",
        element: <AssistedTraining />,
      },
      {
        path: "/home/training/no-asistidos",
        element: <NoAssistedTraining />,
      },
      {
        path: "/home/crear-entrenamiento",
        element: (
          <ProtectedRoute
            element={<CreateTraining />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
      },
      {
        path: "/home/modificar-entrenamiento/:identrenamiento",
        element: (
          <ProtectedRoute
            element={<ModifyTraining />}
            allowedRoles={["Entrenador"]} // Solo entrenadores y admins pueden acceder
          />
        ),
      },
      {
        path: "/home/training/mostrar-entrenamiento/:identrenamiento",
        element: <ShowTraining />,
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
