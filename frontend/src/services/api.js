import axios from 'axios';
import { getIdToken } from './authService';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 60000,
});

// atach token to every request if available
api.interceptors.request.use((config) => {
    const token = getIdToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        //expired or invalid token
        if (error.response.status === 401) {
            sessionStorage.clear();
            window.location.href = '/';
            return Promise.reject(new Error('Session expired.'));
        }
        if (error.response) {
            const message = error.response.data?.message || 'An error occurred';
            return Promise.reject(new Error(message));
        }
        else if (error.request) {
            return Promise.reject(new Error('No response from server'));
        }
        return Promise.reject(error);
    }
);

export default api;