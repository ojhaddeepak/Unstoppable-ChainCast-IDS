import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle different HTTP status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request
      return Promise.reject({ message: error.message });
    }
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
};

// Metrics APIs
export const metricsAPI = {
  getMetrics: () => api.get('/metrics'),
  getHistoricalData: (params = {}) => api.get('/metrics/historical', { params }),
  getThreatStats: () => api.get('/metrics/threat-stats'),
  getNetworkHealth: () => api.get('/metrics/network-health'),
};

// Alerts APIs
export const alertsAPI = {
  getAlerts: (params = {}) => api.get('/alerts', { params }),
  getAlert: (id) => api.get(`/alerts/${id}`),
  updateAlertStatus: (id, status) => api.patch(`/alerts/${id}/status`, { status }),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
};

// Analytics APIs
export const analyticsAPI = {
  getAttackPatterns: (params = {}) => api.get('/analytics/attack-patterns', { params }),
  getGeographicData: (params = {}) => api.get('/analytics/geographic', { params }),
  getTimeSeriesData: (params = {}) => api.get('/analytics/time-series', { params }),
  getThreatIntel: () => api.get('/analytics/threat-intel'),
};

// User Management APIs
export const usersAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  createUser: (userData) => api.post('/users', userData),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.patch(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Export all APIs for convenience
export default {
  auth: authAPI,
  metrics: metricsAPI,
  alerts: alertsAPI,
  analytics: analyticsAPI,
  users: usersAPI,
};

// For backward compatibility
export const fetchMetrics = metricsAPI.getMetrics;
export const fetchAlerts = alertsAPI.getAlerts;
