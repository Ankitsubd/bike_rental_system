import API from "./axios";

const AuthAPI = {
    login:async(email, password)=> {
        try {
            const response = await API.post('/auth/login/', {email,password});
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    register:async(userData)=> {
        try {
            const response = await API.post('/auth/register/', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    logout:async()=> {
        try {
            const response = await API.post('/auth/logout/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    refreshToken: async() => {
        try {
            const response = await API.post('/auth/refresh/', {
                refresh: localStorage.getItem('refresh_token'),
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
}

export default AuthAPI