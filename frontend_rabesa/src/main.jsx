import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Team from "./components/team/Team";
import CreateTrainer from "./components/team/CreateTrainer";
import ModifyTrainer from "./components/team/ModifyTrainer";
import CreatePlayer from "./components/team/CreatePlayer";
import ModifyPlayer from "./components/team/ModifyPlayer";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import Training from "./components/training/Training";
import CreateTraining from "./components/training/CreateTraining";
import ModifyTraining from "./components/training/ModifyTraining";
import AssistedTraining from "./components/training/AssistedTraining";
import NoAssistedTraining from "./components/training/NoAssistedTraining";
import ShowTraining from "./components/training/ShowTraining";
import CreateVerification from "./components/training/CreateVerification";
import SearchTraining from "./components/training/SearchTraining";
import Match from "./components/match/Match";
import CreateMatch from "./components/match/CreateMatch";
import ModifyMatch from "./components/match/ModifyMatch";
import AddResult from "./components/match/AddResult";
import Club from "./components/club/Club";
import CreateClub from "./components/club/CreateClub";
import ModifyClub from "./components/club/ModifyClub";
import "@fontsource/fira-sans"; // Peso 400 (normal)
import "@fontsource/fira-sans/400.css"; // Alternativa
import "@fontsource/fira-sans/500.css"; // Peso 500 (medium)
import "@fontsource/fira-sans/700.css"; // Peso 700 (bold)
import { SnackbarProvider } from "notistack";
import Profile from "./components/Profile";
import { apiUrl } from "./config";

import PaginaError from "./pages/PaginaError";

let router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // Ruta principal para el login
    errorElement: <PaginaError />,
  },
  {
    path: "/home", // Ruta independiente para la página de inicio
    element: <Home />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute
            element={<Dashboard />}
            allowedRoles={["Entrenador", "Jugadora"]}
          />
        ),
      },
      {
        path: "team",
        element: (
          <ProtectedRoute
            element={<Team />}
            allowedRoles={["Entrenador", "Jugadora"]}
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
        element: (
          <ProtectedRoute
            element={<Training />}
            allowedRoles={["Entrenador", "Jugadora"]}
          />
        ),
      },
      {
        path: "/home/training/asistidos",
        element: (
          <ProtectedRoute
            element={<AssistedTraining />}
            allowedRoles={["Jugadora"]}
          />
        ),
      },
      {
        path: "/home/training/no-asistidos",
        element: (
          <ProtectedRoute
            element={<NoAssistedTraining />}
            allowedRoles={["Jugadora"]}
          />
        ),
      },
      {
        path: "/home/buscar-entrenamientos",
        element: (
          <ProtectedRoute
            element={<SearchTraining />}
            allowedRoles={["Entrenador"]}
          />
        ),
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
            allowedRoles={["Entrenador"]}
          />
        ),
      },
      {
        path: "/home/training/mostrar-entrenamiento/:identrenamiento",
        element: (
          <ProtectedRoute
            element={<ShowTraining />}
            allowedRoles={["Entrenador"]}
          />
        ),
      },
      {
        path: "/home/crear-confirmacion/:identrenamiento/:tipoconfirmacion",
        element: (
          <ProtectedRoute
            element={<CreateVerification />}
            allowedRoles={["Entrenador"]}
          />
        ),
      },
      {
        path: "partidos",
        element: (
          <ProtectedRoute
            element={<Match />}
            allowedRoles={["Entrenador", "Jugadora"]}
          />
        ),
      },
      {
        path: "/home/crear-partido",
        element: (
          <ProtectedRoute
            element={<CreateMatch />}
            allowedRoles={["Entrenador"]}
          />
        ),
      },
      {
        path: "/home/modificar-partido/:idpartido",
        element: (
          <ProtectedRoute
            element={<ModifyMatch />}
            allowedRoles={["Entrenador"]}
          />
        ),
      },
      {
        path: "/home/partido/anadir-resultado/:idpartido",
        element: (
          <ProtectedRoute
            element={<AddResult />}
            allowedRoles={["Entrenador"]}
          />
        ),
      },
      {
        path: "club",
        element: (
          <ProtectedRoute
            element={<Club />}
            allowedRoles={["Entrenador", "Jugadora"]}
          />
        ),
      },
      {
        path: "/home/crear-club",
        element: (
          <ProtectedRoute
            element={<CreateClub />}
            allowedRoles={["Entrenador"]}
          />
        ),
      },
      {
        path: "/home/modificar-club/:idclub",
        element: (
          <ProtectedRoute
            element={<ModifyClub />}
            allowedRoles={["Entrenador"]}
          />
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute
            element={<Profile />}
            allowedRoles={["Entrenador", "Jugadora"]}
          />
        ),
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
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={3000}
    >
      <RouterProvider router={router} />
    </SnackbarProvider>
  </StrictMode>
);
