import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  const admin = useSelector((state) => state.admin.admin); 

  if (admin) {
    const decodedtoken = jwtDecode(admin.token);
    if (admin.email === decodedtoken.email) {
      return children;
    }
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminProtectedRoute;
