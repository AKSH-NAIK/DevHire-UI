import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only act if we actually had a token (i.e., session truly expired, not a login attempt)
            const hadToken = !!localStorage.getItem('token');
            if (hadToken) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Dispatch a custom event so AuthContext / React Router can handle
                // the redirect gracefully, instead of a hard window.location.href
                // which wipes React state mid-session and causes further API failures.
                window.dispatchEvent(new CustomEvent('auth:expired'));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
