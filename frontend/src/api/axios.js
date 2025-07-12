import axios, { mergeConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/';

const api = axios.create({
    baseURL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response)=> response,
    async(error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry= true;
            try{
                const res = await axios.post(`${baseURL}auth/token/refresh/`,{
                    refresh : localStorage.getItem('refreshToken'),
                })
                localStorage.setItem('accessToken', res.data.access);
                api.defaults.headers.Authorization =`Bearer ${res.data.access}`;
                return api(originalRequest);
            }catch(err){
                console.error('Refresh failed');
                window.location.href ='/login';
            }
        }
        return Promise.reject(error);
    }
    
);

export default api;