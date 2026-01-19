import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add AbortController signal if not already present
        if (!config.signal) {
            const controller = new AbortController();
            config.signal = controller.signal;
            // Store controller for potential cancellation
            (config as any).__abortController = controller;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle request cancellation
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        // Handle network errors
        if (!error.response) {
            if (error.code === 'ECONNABORTED') {
                // Timeout
                return Promise.reject(new Error('Request timeout. Please try again.'));
            }
            // Network error
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        const status = error.response.status;

        // Handle specific status codes
        switch (status) {
            case 401:
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Use window.location for reliable redirect outside React context
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(new Error('Session expired. Please log in again.'));
            
            case 403:
                return Promise.reject(new Error('You do not have permission to perform this action.'));
            
            case 404:
                return Promise.reject(new Error('Resource not found.'));
            
            case 429:
                return Promise.reject(new Error('Too many requests. Please try again later.'));
            
            case 500:
            case 502:
            case 503:
            case 504:
                return Promise.reject(new Error('Server error. Please try again later.'));
            
            default:
                // Extract error message from response if available
                const message = (error.response.data as any)?.message || error.message || 'An error occurred';
                return Promise.reject(new Error(message));
        }
    }
);

// Utility function to create a cancellable request
export const createCancellableRequest = () => {
    const controller = new AbortController();
    return {
        signal: controller.signal,
        cancel: () => controller.abort(),
    };
};

export default api;
