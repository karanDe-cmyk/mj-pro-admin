import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const accessToken = localStorage.getItem("accessToken");

  if (!isAuthenticated || !accessToken) {
    console.warn("Access denied. Redirecting to login.");
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
