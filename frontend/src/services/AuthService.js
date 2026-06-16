import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class AuthService {
  async login(credentials) {
    try {
      console.log('Sending login request:', credentials);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      console.log('Login response:', response.data);
      const { data } = response.data;
      const { token, user } = data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message;
    }
  }

  async validateToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await axios.get(`${API_BASE_URL}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  }

  async register(userData) {
    try {
      console.log('Sending register request:', userData);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message;
    }
  }

  async getProfile() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
      if (response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        window.dispatchEvent(new Event('authChange'));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Dispatch custom event to notify auth state change
    window.dispatchEvent(new Event('authChange'));
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          id: payload.userId,
          email: payload.sub,
          role: payload.role
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }

    return null;
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

const authService = new AuthService();
export default authService;
