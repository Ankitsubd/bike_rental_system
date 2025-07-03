import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] =useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(()=> {
        if(token) {
            localStorage.setItem('token',token);
        }else {
            localStorage.removeItem('token');
        }
    },[token]);

    const login = async (credentials) => {
        try {
            const response = await loginUser(credentials);
            setUser(response.user);
            setToken(response.token);
            navigate('/dashboard');
            return {
                success: true
            };
        } catch (error) {
            return {
                sucess:false,
            error: error.message}
        }    
    };

    const register = async(userData) => {
        try {
            const response = await registerUser(userData);
            setUser(response.user);
            setToken(response.token);
            navigate('/dashboard');
            return {
                success: true
            };
        } catch (error) {
            return {
                success:false,
                error: error.message
            };
        }
    };
     const logout = () => {
            setUser(null);
            setToken(null);
            navigate('/login');
        }
         
    return(
        <AuthContext.Provider value={{user, token , login , register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);