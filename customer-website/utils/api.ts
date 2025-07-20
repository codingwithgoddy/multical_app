import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
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

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle specific error cases
    if (response && response.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Helper functions for common API operations
export const fetchProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const submitContactForm = async (data: any) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const requestQuote = async (data: any) => {
  const response = await api.post('/quotes', data);
  return response.data;
};