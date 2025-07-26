import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import BikeList from './pages/user/BikeList';
import BikeDetail from './pages/bikes/BikeDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import Bookings from './pages/user/Bookings';
import Dashboard from './pages/admin/Dashboard';
import ManageBikes from './pages/admin/ManageBikes';
import ManageBookings from './pages/admin/ManageBookings';
import ManageReviews from './pages/admin/ManageReviews';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/bikes' element={<BikeList />} />
          <Route path='/bikes/:id' element={<BikeDetail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgetpassword' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword/>}/>
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          <Route path='/user/dashboard' element={<UserDashboard/>}/>
          {/* Protected Customer Route */}
          <Route
            path='/user/bookings'
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
        
        
          {/* Admin Protected Routes with Layout */}
          <Route
            path='/admin/dashboard'
            element={
              <ProtectedRoute role="is_admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='bikes' element={<ManageBikes />} />
            <Route path='bookings' element={<ManageBookings />} />
            <Route path='reviews' element={<ManageReviews />} />
          </Route>

          {/* Catch-all */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      
      <Footer />
    </AuthProvider>
  );
};

export default App;
