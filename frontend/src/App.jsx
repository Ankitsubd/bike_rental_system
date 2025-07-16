import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import BikeList from './pages/user/BikeList';
import BikeDetail from './pages/bikes/BikeDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Bookings from './pages/user/Bookings';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageBikes from './pages/admin/ManageBikes';
import ManageBookings from './pages/admin/ManageBookings';
import ManageReviews from './pages/admin/ManageReviews';
import ResetPassword from './pages/auth/ResetPassword';
const App = () => {
  return (
    <AuthProvider>
      
      <Navbar/>
        <div className='min-h-[80vh] bg-gray-50'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/bikes' element={<BikeList/>}/>
            <Route path='/bikes/:id' element={<BikeDetail/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>

            {/**User protected Routes */}
            <Route
            path='/user/bookings'
            element={
              <ProtectedRoute>
                <Bookings/>
              </ProtectedRoute>
            }
            />
            {/**Admin Protected Routes with layout */}
            <Route
            path='/admin/*'
            element={
              <ProtectedRoute role="is_admin">
                <AdminLayout>
                  <Routes>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/bikes' element={<ManageBikes/>}/>
                    <Route path='/bookings' element={<ManageBookings/>}/>
                    <Route path='/reviews' element={<ManageReviews/>}/>
                    <Route path='/' element={<Dashboard/>}/>
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
            />

            {/**Catch all */}
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
      <Footer/>
    
    </AuthProvider>
     
  )
}

export default App