// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check token on page load
    useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        console.error('Invalid token');
        setUser(null);
      }
    }
  }, []);

  // const login = ({ access, refresh }) => {
  //   localStorage.setItem('accessToken', access);
  //   localStorage.setItem('refreshToken', refresh);

  //   try {
  //     const decoded = jwtDecode(access);
  //     setUser(decoded);
  //   } catch (e) {
  //     console.error('Failed to decode token');
  //     setUser(null);
  //   }

 const login = async ({ email, password }) => {
    const userData = await loginAPI({ email, password });
    setUser(userData); 
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
