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
            // Clear storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // We can't use useNavigate here as it's not a component
            // But we can trigger a window event or let the AuthContext handle it via state
            // For now, let's just clear and let the next state update handle logic
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
