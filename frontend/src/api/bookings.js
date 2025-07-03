import API, { createBooking } from './axios';

export const BookingsAPI = {
    getAllBookings: async() =>{
        try {
            const response = await API.get('/bookings/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getBookingById: async(id)=>{
        try {
            const response = await API.get(`/bookings/${id}/`);
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    createBooking: async(bookingData) => {
        try {
            const response= await API.post('/bookings/',bookingData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    cancelBooking: async(id) => {
        try {
            const response = await API.delete(`/bookings/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}