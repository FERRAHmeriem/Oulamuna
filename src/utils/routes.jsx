import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Welcome from "../pages/Welcome";
<<<<<<< HEAD
/**
 * 🔒 Route protégée
 * @param {boolean} adminOnly - uniquement accessible par les admins
 * @param {boolean} userOnly - uniquement accessible par les utilisateurs normaux
 */
=======
>>>>>>> ec8cb114c15b0274fb475b95ab774fc0285f9173
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

export const HomeRedirect = () => {
  const { currentUser } = useSelector((state) => state.user);
  if (currentUser) {
    if (currentUser.role === "admin") {
    return <Navigate to="/admin_home" replace />;
  }

  return <Navigate to="/articles" replace />;
  }else  return <Welcome />;
  } 
 
