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

if (typeof window !== 'undefined') {
  console.log('[BOOKING DEBUG] API BASE URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach JWT Token if available & Log Request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('atelier_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`[BOOKING DEBUG] REQUEST -> ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Log Response / Retry on Network Error
api.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined' && response.config.url?.includes('/appointments/availability')) {
      console.log('[BOOKING DEBUG] RESPONSE STATUS:', response.status);
      console.log('[BOOKING DEBUG] RESPONSE DATA:', response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (typeof window !== 'undefined') {
      console.error('[BOOKING DEBUG] ERROR:', error.message, error.response ? error.response.status : 'No Response / Network Error');
    }

    if (!originalRequest) return Promise.reject(error);

    originalRequest._retryCount = originalRequest._retryCount || 0;

    const isNetworkError =
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      !error.response ||
      (error.response && error.response.status >= 502);

    if (isNetworkError && originalRequest._retryCount < 3 && originalRequest.method === 'get') {
      originalRequest._retryCount += 1;
      const delayMs = originalRequest._retryCount === 1 ? 1000 : originalRequest._retryCount === 2 ? 2500 : 5000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
