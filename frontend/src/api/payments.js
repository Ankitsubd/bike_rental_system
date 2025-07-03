import API from './axios';

export const PaymentsAPI ={
    createPaymentIntent: async(amount)=>{
        try {
            const response = await API.post ('/payments/create-intent/',{amount});
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    confirmPayment: async(paymentId)=>{
        try {
            const response = await API.post('/payments/confirm/', {paymentId});
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
}