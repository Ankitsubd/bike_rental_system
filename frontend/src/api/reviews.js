import API from './axios';

export const ReviewsAPI ={
    getReviewsByBike: async(bikeId)=>{
        try {
            const response = await API.get(`/reviews/?bike_id=${bikeId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    createReview: async(reviewData)=>{
        try {
            const response = await API.post('/reviews/',reviewData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
}