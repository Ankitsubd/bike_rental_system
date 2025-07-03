import axios from "axios";

const API_BASE_URL= 'http://your-django-backend-api.com';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type' : 'application/json',
    }
})

    //request interceptor to attach JWT token
    API.interceptors.request.use(
        (config)=>{
            const token = localStorage.getItem('access_token');
            if(token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error)=> Promise.reject(error)  
    );

    //response interceptor for error handling
    API.interceptors.response.use(
        (response) => response,
        (error)=> {
            if(error.response?.status === 401){
                console.error('Unauthorized! redirecting to login...');
                window.location.href='/login';
            }
            return Promise.reject(error);
        }
    );
 export default API