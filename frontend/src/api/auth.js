import api from "./axios";

export const login = async(data) => {
    const res = await api.post('auth/login/',data);
    localStorage.setItem('accessToken', res.data.access);
    localStorage.setItem('refreshToken', res.data.refresh);
    return res.data;
};

export const register = (data)=> api.post('auth/register/',data);
export const verifyEmail = (token) => api.get(`auth/verify-email/?token=${token}`);
export const requestPasswordReset = (email) => api.post('auth/password-reset/',{email});
export const resetPassword = (data) => api.post('/auth/password-reset/confirm',data);
export const changePassword =(data)=> api.post('auth/change-password/',data);
export const logout =()=> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};
