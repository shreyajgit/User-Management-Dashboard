import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('fullname');
  const loginTime = localStorage.getItem('loginTime');

  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
//   const maxAge = 1 * 60 * 1000; // 1 minute for testing purposes


  if (isLoggedIn && loginTime) {
    const timePassed = Date.now() - parseInt(loginTime, 10);
    if (timePassed > maxAge) {
      // Auto logout after 7 days
      localStorage.clear();
      alert("Session expired. Please login again.");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
