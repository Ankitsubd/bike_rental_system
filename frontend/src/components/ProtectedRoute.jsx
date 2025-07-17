// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (role && !user[role]) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
