// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.is_admin ? children : <Navigate to="/unauthorized" />;
};

export default AdminRoute;
