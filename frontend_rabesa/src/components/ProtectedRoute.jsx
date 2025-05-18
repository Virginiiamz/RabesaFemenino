import React, { useEffect, useState } from "react";
import useUserStore from "../stores/useUserStore"; // Asegúrate de que la ruta sea correcta
import { useNavigate, Outlet, Navigate } from "react-router";
import { apiUrl } from "../config";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isLoggedIn } = useUserStore();
  const navigate = useNavigate();

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
