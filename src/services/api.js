import axios from 'axios';

const getDefaultApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://salman-backend.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getDefaultApiUrl();



const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { safeLocalStorage } from '@/utils/storage';

// Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = safeLocalStorage.getItem('atelier_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Retry on Network Error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    originalRequest._retryCount = originalRequest._retryCount || 0;

    const isNetworkError =
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      !error.response ||
      (error.response && error.response.status >= 502);

    if (isNetworkError && originalRequest._retryCount < 2 && originalRequest.method === 'get') {
      originalRequest._retryCount += 1;
      const delayMs = originalRequest._retryCount === 1 ? 1500 : 4000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
