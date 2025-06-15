import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    // Δεν υπάρχει ρόλος => redirect στο login
    return <Navigate to="/login" />;
  }

  if (allowedRoles.includes(userRole)) {
    // Έχει δικαίωμα πρόσβασης
    return children;
  } else {
    // Δεν έχει δικαίωμα => redirect στο login (ή σε δική σου 403 σελίδα αν θες)
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;