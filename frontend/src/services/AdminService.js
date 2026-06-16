import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class AdminService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async getAllUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getPendingUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/pending`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async verifyUser(userId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/users/${userId}/verify`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async rejectUser(userId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/users/${userId}/reject`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async suspendUser(userId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/users/${userId}/suspend`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async activateUser(userId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/users/${userId}/activate`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getPendingFarmers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/farmers/pending`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getFarmersByStatus(status) {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/farmers/status/${status}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async verifyFarmer(farmerId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/farmers/${farmerId}/verify`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async rejectFarmer(farmerId, rejectionReason) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/farmers/${farmerId}/reject`, { rejectionReason }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getTotalFarmersCount() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats/farmers`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getTotalUsersCount() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats/users`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getPlatformOrders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async assignOrderToDistributor(orderId, distributorId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/orders/${orderId}/assign-distributor`,
        null,
        {
          headers: this.getAuthHeaders(),
          params: { distributorId }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getDistributors() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: this.getAuthHeaders()
      });
      // Filter only distributors
      if (response.data && response.data.data) {
        return {
          ...response.data,
          data: response.data.data.filter(user => user.role === 'DISTRIBUTOR')
        };
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

const adminService = new AdminService();
export default adminService;
