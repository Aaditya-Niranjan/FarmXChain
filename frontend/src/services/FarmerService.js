import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class FarmerService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async getFarmerProfile() {
    try {
      const response = await axios.get(`${API_BASE_URL}/farmers/profile`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async createFarmerProfile(profileData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/farmers/profile`, profileData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async updateFarmerProfile(profileData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/farmers/profile`, profileData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getAllFarmers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/farmers/all`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getFarmersByCrop(cropType) {
    try {
      const response = await axios.get(`${API_BASE_URL}/farmers/crop/${cropType}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getFarmerById(farmerId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/farmers/${farmerId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async deleteFarmer(farmerId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/farmers/${farmerId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get list of all distributors
  async getDistributors() {
    try {
      const response = await axios.get(`${API_BASE_URL}/farmers/distributors`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Assign order to distributor
  async assignOrderToDistributor(orderId, distributorId) {
    try {
      // Ensure distributorId is a number
      const numericDistributorId = parseInt(distributorId, 10);

      console.log('FarmerService.assignOrderToDistributor called');
      console.log('orderId:', orderId, 'type:', typeof orderId);
      console.log('distributorId:', numericDistributorId, 'type:', typeof numericDistributorId);

      const response = await axios.post(
        `${API_BASE_URL}/farmers/orders/${orderId}/assign-distributor`,
        null,
        {
          headers: this.getAuthHeaders(),
          params: { distributorId: numericDistributorId }
        }
      );
      console.log('FarmerService response:', response.data);
      return response.data;
    } catch (error) {
      console.error('FarmerService error:', error);
      console.error('Error response:', error.response);
      throw error.response?.data || error.message;
    }
  }
}

const farmerService = new FarmerService();
export default farmerService;
