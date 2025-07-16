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

import api from './axios';
import { jwtDecode } from 'jwt-decode';

// Login user
export const loginAPI = async ({ email, password }) => {
  try {
    const res = await api.post('login/', { email, password });
    return res.data; 
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// Register user
export const register = async ({ email, password }) => {
  const res = await api.post('register/', { email, password });
  return res.data;
};

// Email verification
export const verifyEmail = (uid, token) => api.get(`verify-email/${uid}/${token}/`);

// Request password reset
export const requestPasswordReset = (email) => api.post('request-reset/', { email });

// Reset password with token
export const resetPassword = (data) => api.patch('set-new-password/', data);

// Change password (authenticated)
export const changePassword = (data) => api.put('change-password/', data);

// Logout
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
