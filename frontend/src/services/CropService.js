import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class CropService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async addCrop(cropData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/crops/add`, cropData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getMyCrops() {
    try {
      const response = await axios.get(`${API_BASE_URL}/crops/my-crops`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getCropById(cropId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/crops/${cropId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getAllCrops() {
    try {
      const response = await axios.get(`${API_BASE_URL}/crops/all`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getCropsWithBlockchainRecords() {
    try {
      const response = await axios.get(`${API_BASE_URL}/crops/blockchain-records`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async verifyBlockchainRecord(cropId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/crops/${cropId}/verify-blockchain`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

const cropService = new CropService();
export default cropService;
