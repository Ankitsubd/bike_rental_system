
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import  useAuth  from '../hooks/useAuth.js'; // assuming you have this hook for auth context

const ProtectedRoute = ({ role }) => {
  const { user } = useAuth(); // get current logged in user info

  // If no user logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified and user role doesn't match, redirect to unauthorized or home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render nested routes
  return <Outlet />;
}
export default ProtectedRoute;
