// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return (user?.is_staff || user?.is_superuser) ? children : <Navigate to="/unauthorized" />;
};

export default AdminRoute;
