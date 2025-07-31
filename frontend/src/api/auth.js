import api from './axios';
import { jwtDecode } from 'jwt-decode';

// Login user
export const loginAPI = async ({ email, password }) => {
  try {
    const res = await api.post('login/', { email, password });
    const { access, refresh, is_staff, is_superuser, username, is_verified } = res.data;

    if (!access || !refresh) {
      throw new Error("Incomplete response from server");
    }

    // Store tokens and metadata
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('role', (is_staff || is_superuser) ? 'admin' : 'customer');
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('is_staff', is_staff);
    localStorage.setItem('is_superuser', is_superuser);
    localStorage.setItem('is_verified', is_verified);

    // Return decoded token to AuthContext
    const decoded = jwtDecode(access);
    return {
      ...decoded,
      is_staff,
      is_superuser,
      is_verified,
      username,
      email
    };
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    throw err;
  }
};

// Register with email, password, full_name, and phone_number
export const register = (data) => {
  // Send all required fields to backend
  const { email, password, full_name, phone_number } = data;
  console.log('Sending registration data:', { email, password, full_name, phone_number });
  return api.post('register/', { email, password, full_name, phone_number });
};

// Email verification
export const verifyEmail = (uid, token) => api.get(`verify-email/${uid}/${token}/`);

// Request password reset
export const requestPasswordReset = (email) => api.post('reset-password/', { email });

// Reset password with token
export const resetPassword = (token, data) => api.patch(`set-new-password/${token}/`, data, {
  headers: { Authorization: '' },
});

// Change password (authenticated)
export const changePassword = (data) => api.put('change-password/', data);

// Logout
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  localStorage.removeItem('username');
  localStorage.removeItem('is_staff');
  localStorage.removeItem('is_superuser');
  localStorage.removeItem('is_verified');
};

// Get user profile
export const getUserProfile = async () => {
  const res = await api.get('user/profile/');
  return res.data;
};

// Update user profile
export const updateUserProfile = async (data) => {
  const res = await api.put('user/update-profile/', data);
  return res.data;
};
