import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5175/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
};

// Tasks API
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;