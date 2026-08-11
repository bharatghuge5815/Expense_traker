import api from './api';

/**
 * Configure Axios request interceptor to attach JWT token from localStorage
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Register User API call
 */
export const registerApi = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

/**
 * Login User API call
 */
export const loginApi = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Get Current Logged-in User Profile API call
 */
export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Logout API call
 */
export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
