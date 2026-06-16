import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/orders';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

const placeOrder = async (orderData) => {
    const response = await axios.post(API_URL, orderData, { headers: getAuthHeader() });
    return response.data;
};

const getMyPurchases = async () => {
    const response = await axios.get(`${API_URL}/buyer`, { headers: getAuthHeader() });
    return response.data;
};

const getMySales = async () => {
    const response = await axios.get(`${API_URL}/farmer`, { headers: getAuthHeader() });
    return response.data;
};

const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.patch(`${API_URL}/${orderId}/status?status=${status}`, {}, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const OrderService = {
    placeOrder,
    getMyPurchases,
    getMySales,
    updateOrderStatus
};

export default OrderService;
