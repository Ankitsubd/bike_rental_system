import API from './axios';

export const BikesAPI = {
    getAllBikes: async () =>{
        try {
            const response = await API.get('/bikes/');
            return response.data;
        } catch (error) {
            throw error.response?. data || error.message;
        }
    },
    getBikeById: async(id) =>{
        try {
            const response = await API.get(`/bikes/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    createBike: async(bikeData) => {
        try {
            const response = await API.put('/bikes/', bikeData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
        updateBike: async(id,bikeData) => {
        try {
            const response = await API.put(`/bikes/${id}/`, bikeData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
        deleteBike: async(id) => {
        try {
            const response = await API.delete(`/bikes/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}