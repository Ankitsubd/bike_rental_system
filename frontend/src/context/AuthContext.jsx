// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginAPI } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token on page load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          // Check if token is expired
          if (decoded.exp < currentTime) {
            console.log('Token expired, clearing auth');
            logout();
            setLoading(false);
            return;
          }

          // Get additional user info from localStorage
          const role = localStorage.getItem('role');
          const email = localStorage.getItem('email');
          const username = localStorage.getItem('username');
          const is_staff = localStorage.getItem('is_staff') === 'true';
          const is_superuser = localStorage.getItem('is_superuser') === 'true';
          const is_customer = localStorage.getItem('is_customer') === 'true';
          const is_verified = localStorage.getItem('is_verified') === 'true';
          
          setUser({
            ...decoded,
            is_staff: is_staff || role === 'admin',
            is_superuser: is_superuser || role === 'admin',
            is_customer: is_customer || role === 'customer',
            is_verified,
            email,
            username
          });
        } catch (e) {
          console.error('Invalid token:', e);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const userData = await loginAPI({ email, password });
      setUser(userData);
      
      // Store additional user info in localStorage
      localStorage.setItem('is_staff', userData.is_staff);
      localStorage.setItem('is_superuser', userData.is_superuser);
      localStorage.setItem('is_customer', userData.is_customer);
      localStorage.setItem('is_verified', userData.is_verified);
      
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('is_superuser');
    localStorage.removeItem('is_customer');
    localStorage.removeItem('is_verified');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
