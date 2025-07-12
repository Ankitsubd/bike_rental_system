import api from "./axios";

export const getBikes = () => api.get('bikes/');
export const getBikeDetail = (id) => api.get(`bikes/${id}`);

export const createBike=(data) =>api.post('bikes/',data);
export const updateBike = (id,data) => api.put(`bikes/${id}/`,data);
export const deleteBike = (id) => api.delete(`bikes/${id}/`);