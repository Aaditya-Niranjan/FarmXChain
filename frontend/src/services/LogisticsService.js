import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/logistics';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

const startShipment = async (orderId) => {
    const response = await axios.post(`${API_URL}/order/${orderId}`, {}, { headers: getAuthHeader() });
    return response.data;
};

const updateShipment = async (shipmentId, updateData) => {
    const response = await axios.patch(`${API_URL}/${shipmentId}`, updateData, { headers: getAuthHeader() });
    return response.data;
};

const getShipmentByOrder = async (orderId) => {
    const response = await axios.get(`${API_URL}/order/${orderId}`, { headers: getAuthHeader() });
    return response.data;
};

const LogisticsService = {
    startShipment,
    updateShipment,
    getShipmentByOrder
};

export default LogisticsService;
