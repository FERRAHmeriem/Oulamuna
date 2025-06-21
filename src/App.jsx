import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from  "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/welcome";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute/>}>
        
        </Route>
      </Routes>
  );
}

export default App;