import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class UserService {
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    }

    async getUserProfile() {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/profile`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getUserById(userId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getUsersByRole(role) {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/role/${role}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getAllFarmers() {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/farmers/all`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getAllDistributors() {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/distributors/all`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getAllRetailers() {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/retailers/all`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getAllConsumers() {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/consumers/all`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async topUpWallet(amount) {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/top-up`, null, {
                params: { amount },
                headers: this.getAuthHeaders()
            });
            if (response.data.data) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                window.dispatchEvent(new Event('authChange'));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

const userService = new UserService();
export default userService;
