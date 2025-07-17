import api from './axios';

export const createBooking = (data) => api.post('bookings/',data);
export const getUserBookings = () => api.get('bookings/');

export const getAllBookings = () => api.get('bookings/');
export const updateBooking = (id,data)=> api.put(`bookings/${id}/`,data);
export const deleteBooking = (id) => api.delete(`bookings/${id}/`); 