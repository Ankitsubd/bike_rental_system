// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginAPI } from '../api/auth';
import { refreshToken } from '../utils/tokenRefresh';

// Provide default values to prevent undefined errors
const defaultContext = {
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true
};

export const AuthContext = createContext(defaultContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token on page load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          // Check if token is expired
          if (decoded.exp < currentTime) {
            console.log('Token expired, attempting background refresh');
            const refreshSuccess = await refreshToken();
            
            if (!refreshSuccess) {
              console.log('Background refresh failed, clearing auth');
              logout();
              setLoading(false);
              return;
            }
            
            // Get the new token after refresh
            const newToken = localStorage.getItem('accessToken');
            if (newToken) {
              const newDecoded = jwtDecode(newToken);
              setUserFromToken(newDecoded);
            }
          } else {
            // Token is valid, set user
            setUserFromToken(decoded);
          }
        } catch (e) {
          console.error('Invalid token:', e);
          logout();
        }
      }
      setLoading(false);
    };

    const setUserFromToken = (decoded) => {
      // Get additional user info from localStorage
      const role = localStorage.getItem('role');
      const email = localStorage.getItem('email');
      const username = localStorage.getItem('username');
      const full_name = localStorage.getItem('full_name');
      const phone_number = localStorage.getItem('phone_number');
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
        username,
        full_name,
        phone_number
      });
    };

    checkAuth();
  }, []);

  // Set up periodic token refresh (every 4 minutes to refresh before 5-minute expiry)
  useEffect(() => {
    const tokenRefreshInterval = setInterval(async () => {
      if (user) {
        await refreshToken();
      }
    }, 4 * 60 * 1000); // 4 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, [user]);

  const login = async ({ email, password }) => {
    try {
      const userData = await loginAPI({ email, password });
      setUser(userData);
      
      // Store additional user info in localStorage
      localStorage.setItem('is_staff', userData.is_staff);
      localStorage.setItem('is_superuser', userData.is_superuser);
      localStorage.setItem('is_customer', userData.is_customer);
      localStorage.setItem('is_verified', userData.is_verified);
      if (userData.full_name) localStorage.setItem('full_name', userData.full_name);
      if (userData.phone_number) localStorage.setItem('phone_number', userData.phone_number);
      
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
    localStorage.removeItem('full_name');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('is_superuser');
    localStorage.removeItem('is_customer');
    localStorage.removeItem('is_verified');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Update localStorage with new user data
    if (userData.email) localStorage.setItem('email', userData.email);
    if (userData.username) localStorage.setItem('username', userData.username);
    if (userData.full_name) localStorage.setItem('full_name', userData.full_name);
    if (userData.phone_number) localStorage.setItem('phone_number', userData.phone_number);
    if (userData.is_staff !== undefined) localStorage.setItem('is_staff', userData.is_staff);
    if (userData.is_superuser !== undefined) localStorage.setItem('is_superuser', userData.is_superuser);
    if (userData.is_customer !== undefined) localStorage.setItem('is_customer', userData.is_customer);
    if (userData.is_verified !== undefined) localStorage.setItem('is_verified', userData.is_verified);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
