import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./Admin.css";
import Sidebar from "../Component/Sidebar.jsx/Sidebar";
import AddProduct from "../AddProduct/AddProduct";
import Listproduct from "../ListProduct/Listproduct";
import Login from "../login/Login";

const Admin = ({ setLogin, isLoggedIn }) => {
  return (
    <div className="admin">
      {isLoggedIn && <Sidebar />}
      <Routes>
        <Route
          path="/addproduct"
          element={isLoggedIn ? <AddProduct /> : <Navigate to="/login" />}
        />
        <Route
          path="/listproduct"
          element={isLoggedIn ? <Listproduct /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login setLogin={setLogin} />} />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} />}
        />
      </Routes>
    </div>
  );
};

export default Admin;
