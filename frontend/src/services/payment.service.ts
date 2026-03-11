import api from './api';

export const paymentService = {
    createCheckout: async (plan: 'pro'): Promise<{ token: string; redirectUrl: string }> => {
        const { data } = await api.post('/payments/checkout', { plan });
        return data;
    },

    verifyPayment: async (orderID: string): Promise<{ plan: string }> => {
        const { data } = await api.get(`/payments/verify?order_id=${orderID}`);
        return data;
    },
};