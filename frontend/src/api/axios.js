import axios  from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1/',
    // withCredentials: true,
    headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
},
(error)=> Promise.reject(error)
);

api.interceptors.response.use(
    (response)=> response,
    async(error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry= true;
            try{
                const res = await axios.post(`${api.defaults.baseURL}/token/refresh/`,{
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