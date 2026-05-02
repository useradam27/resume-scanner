import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 60000,
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
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