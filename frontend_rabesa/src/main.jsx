import { StrictMode } from "react";
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
        path: "/home/buscar-entrenamientos",
        element: <SearchTraining />,
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
        element: <Match />,
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
        element: <Club />,
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
        element: <Profile />,
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
