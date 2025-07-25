// import api from "./axios"; 

// export const login = async (email,password) => {
//   try {
//     const res = await api.post("http://127.0.0.1:8000/api/v1/login/", data);
//     console.log("Login response:", res.data); 

//     const access = res.data.access;
//     const refresh = res.data.refresh;

//     if (!access || typeof access !== 'string') {
//       throw new Error("Access token is missing or invalid");
//     }

//     const decoded = jwtDecode(res.access);
//     console.log("Decoded JWT:", decoded);

//     localStorage.setItem("accessToken", res.access);
//     localStorage.setItem("refreshToken", refresh);

//     return res.data;
//   } catch (error) {
//     console.error("Login failed:", error);
//     throw error;
//   }
// };


// // Register with only email and password
// export const register = async({email,password})=>{
//   const response = await api.post('http://127.0.0.1:8000/api/v1/register/'
// ,{
//     email,
//     password
//   });
//   return response.data;
// }

// // Email verification via uid/token
// export const verifyEmail = (uid, token) => api.get(`verify-email/${uid}/${token}/`);

// // Request password reset link
// export const requestPasswordReset = (email) => api.post('request-reset/', { email });

// // Reset password with token (PATCH method if required by backend)
// export const resetPassword = (data) => api.patch('set-new-password/', data);

// // Change password (requires auth)
// export const changePassword = (data) => api.put('change-password/', data);

// // Logout = clear localStorage
// export const logout = () => {
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
// };

import { useState } from 'react';
import api from './axios';
import { jwtDecode } from 'jwt-decode';

// Login user

export const loginAPI = async ({ email, password }) => {
  try {
<<<<<<< HEAD
    const res = await api.post("http://localhost:8000/api/token/", data);
    console.log("Login response:", res.data); // ✅ Add this line
=======
    const res = await api.post('login/', { email, password });
    const { access, refresh, is_admin, is_customer, username } = res.data;
>>>>>>> aac094d2dc79dbd05e79708102d9a3c2ce6bdf16

    if (!access || !refresh) {
      throw new Error("Incomplete response from server");
    }

    // Store tokens and metadata
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('role', is_admin ? 'admin' : 'customer');
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);

    // Return decoded token to AuthContext
    const decoded = jwtDecode(access);
    return {
      ...decoded,
      is_admin,
      is_customer,
      username,
      email
    };
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    throw err;
  }
};


<<<<<<< HEAD
// Register with only email and password
export const register = (data) => api.post('http://localhost:8000/api/v1/register/', data);
=======
// Register user
export const register = async ({ email, password }) => {
  const res = await api.post('register/', { email, password });
  return res.data;
};
>>>>>>> aac094d2dc79dbd05e79708102d9a3c2ce6bdf16

// Email verification
export const verifyEmail = (uid, token) => api.get(`verify-email/${uid}/${token}/`);

// Request password reset
export const requestPasswordReset = (email) => api.post('reset-password/', { email });

// Reset password with token
export const resetPassword = (token,data) => api.patch(`set-new-password/${token}/`, data,{
  headers: {Authorization:''},
});

// Change password (authenticated)
export const changePassword = (data) => api.patch('change-password/', data);

// Logout
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getUserProfile = async()=>{
  const res = await api.get('/users/me/');
  return res.data;
};

export const updateUserProfile = async(data)=>{
  const res = await api.put('/users/me/',data);
  return res.data
}
