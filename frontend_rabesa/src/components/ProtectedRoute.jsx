import React, { useEffect, useState } from "react";
import useUserStore from "../stores/useUserStore"; // Asegúrate de que la ruta sea correcta
import { useNavigate, Outlet, Navigate } from "react-router";
import { apiUrl } from "../config";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isLoggedIn, setUser } = useUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuario solo si no está cargando y no hay usuario
    const verificarUsuario = async () => {
      setLoading(true); // Indica que estamos verificando
      try {
        const response = await fetch(`${apiUrl}/usuario/verificar`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("Respuesta de verificar:", data);

        if (
          response.ok &&
          data.datos &&
          data.datos.rol &&
          data.datos.rol !== "None"
        ) {
          setUser(data.datos);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar usuario:", error);
        setUser(null);
      } finally {
        setLoading(false); // Termina la carga
      }
    };

    if (!user && loading) {
      verificarUsuario();
    } else {
      setLoading(false);
    }
  }, [user, setUser, loading]); // Dependencias correctas

  if (user && window.location.pathname === "/") {
    return <Navigate to="/home/dashboard" replace />;
  }

  if (!user) {
    // User no logueado
    navigate("/", { replace: true });
    return;
  }

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // <Outlet></Outlet>;
  return element ? element : <Outlet />;
  // return element;
};

export default ProtectedRoute;
