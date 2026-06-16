import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/distributor';

// Add auth token to all requests
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

class DistributorService {
    // Get all orders assigned to the current distributor
    async getAssignedOrders(status = null) {
        try {
            const params = status ? { status } : {};
            const response = await axios.get(`${API_URL}/orders`, {
                headers: getAuthHeader(),
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching assigned orders:', error);
            throw error;
        }
    }

    // Create a new shipment for an order
    async createShipment(shipmentData) {
        try {
            const response = await axios.post(`${API_URL}/shipments`, shipmentData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating shipment:', error);
            throw error;
        }
    }

    // Update shipment status
    async updateShipmentStatus(shipmentId, statusUpdateData) {
        try {
            const response = await axios.put(
                `${API_URL}/shipments/${shipmentId}/status`,
                statusUpdateData,
                {
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating shipment status:', error);
            throw error;
        }
    }

    // Confirm delivery
    async confirmDelivery(deliveryData) {
        try {
            const response = await axios.post(`${API_URL}/shipments/deliver`, deliveryData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error confirming delivery:', error);
            throw error;
        }
    }

    // Get shipment logs
    async getShipmentLogs(shipmentId) {
        try {
            const response = await axios.get(`${API_URL}/shipments/${shipmentId}/logs`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching shipment logs:', error);
            throw error;
        }
    }

    // Get shipment by order ID (from logistics service)
    async getShipmentByOrderId(orderId) {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/logistics/order/${orderId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching shipment by order:', error);
            throw error;
        }
    }
}

const distributorService = new DistributorService();
export default distributorService;
