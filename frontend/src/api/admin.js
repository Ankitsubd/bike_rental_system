import React from 'react'
import API from './axios'

export const fetchAdminStats = async()=>{
    try {
        const response = await API.get('/admin/stats/');
        return response.data;      
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
    }
};

//add other admin-related api calls
export const fetchAllUsers = () => API.get('/admin/users/');
export const updateUserRole = (userId, role)=> 
    API.patch(`/admin/users/${userId}/`,{role});