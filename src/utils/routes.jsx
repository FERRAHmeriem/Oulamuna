// src/utils/routes.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * 🔒 Route protégée
 * @param {boolean} adminOnly - uniquement accessible par les admins
 * @param {boolean} userOnly - uniquement accessible par les utilisateurs normaux
 */
export const PrivateRoute = ({ adminOnly = false, userOnly = false }) => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/not-found" replace />;
  }

  if (userOnly && currentUser.role === "admin") {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

/**
 * 🔁 Redirection intelligente depuis "/"
 */
export const HomeRedirect = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser?.role === "admin") {
    return <Navigate to="/admin_home" replace />;
  }

  return <Navigate to="/articles" replace />;
};
