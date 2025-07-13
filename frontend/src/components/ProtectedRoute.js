// 📁 components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  // If logged in, show the children (actual page)
  // Otherwise, redirect to login
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
