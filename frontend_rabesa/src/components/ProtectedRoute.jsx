import React, { useEffect } from "react";
import useUserStore from "../stores/useUserStore"; // Asegúrate de que la ruta sea correcta
import { useNavigate, Outlet, Navigate } from "react-router";

// const ProtectedRoute = ({ allowedRoles }) => {
//     const { user } = useUserStore();
//     const navigate = useNavigate();

//     useEffect(() => {
//       if (!user) {  // User no logueado
//         navigate("/", { replace: true });
//         return;
//       }

//       if (!allowedRoles.includes(user.rol)) {  // Rol no permite acceso
//         navigate("/unauthorized", { replace: true });
//       }
//     }, [user, allowedRoles, navigate]); // Se ejecuta cuando cambia user o allowedRoles

//     if (!user || !allowedRoles.includes(user.rol)) {
//       return null; // Evita que Outlet se renderice antes de la navegación
//     }

//     return <Outlet />;
//   };

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isLoggedIn } = useUserStore();

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
