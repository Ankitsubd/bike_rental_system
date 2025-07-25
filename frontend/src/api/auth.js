import api from "./axios"; 

export const login = async (data) => {
  try {
    const res = await api.post("http://localhost:8000/api/token/", data);
    console.log("Login response:", res.data); // ✅ Add this line

    const access = res.data.access;
    const refresh = res.data.refresh;

    if (!access || typeof access !== 'string') {
      throw new Error("Access token is missing or invalid");
    }

    const decoded = jwtDecode(access);
    console.log("Decoded JWT:", decoded);

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    return res.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};


// Register with only email and password
export const register = (data) => api.post('http://localhost:8000/api/v1/register/', data);

// Email verification via uid/token
export const verifyEmail = (uid, token) => api.get(`verify-email/${uid}/${token}/`);

// Request password reset link
export const requestPasswordReset = (email) => api.post('request-reset/', { email });

// Reset password with token (PATCH method if required by backend)
export const resetPassword = (data) => api.patch('set-new-password/', data);

// Change password (requires auth)
export const changePassword = (data) => api.put('change-password/', data);

// Logout = clear localStorage
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
