import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fix: Add the port number 5000 to the URL
const API_URL = 'http://192.168.150.219:5000/api';

// For debugging: Add console logs to check connection
console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to avoid long waiting times
  timeout: 10000
});

// Add request/response interceptors for debugging
api.interceptors.request.use(async (config) => {
  try {
    console.log('Making request to:', config.url);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('Response received:', response.status);
    return response;
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error data:', error.response.data);
      console.error('Response error status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    try {
      console.log('Sending registration data:', { username, email, password: '****' });
      const response = await api.post('/auth/register', { username, email, password });
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  verifyOtp: async (userId: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { userId, otp });
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },
  
  resendOtp: async (userId: string) => {
    try {
      const response = await api.post('/auth/resend-otp', { userId });
      return response.data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  }
};

export default api;