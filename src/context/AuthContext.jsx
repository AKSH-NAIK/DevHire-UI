import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch profile using the /me endpoint
                const response = await api.get('/users/me');
                // Backend may wrap user in response.data.user OR just response.data
                const fetchedUser = response.data.user || response.data;
                console.log('[AuthContext] /users/me response:', JSON.stringify(fetchedUser));
                setUser(fetchedUser);
            } catch (error) {
                console.error('Auth check failed:', error);
                // Don't clear auth if it's a server error (5xx) or 403 —
                // fall back to the locally stored user so admin isn't kicked out
                if (error.response?.status === 401) {
                    // Truly unauthorized — clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                } else {
                    // For network errors, 403, 500 etc — try to use the cached user
                    try {
                        const cached = localStorage.getItem('user');
                        if (cached && cached !== 'null' && cached !== 'undefined') {
                            const cachedUser = JSON.parse(cached);
                            console.log('[AuthContext] Using cached user:', JSON.stringify(cachedUser));
                            setUser(cachedUser);
                        } else {
                            setUser(null);
                        }
                    } catch {
                        setUser(null);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const handleAuthExpired = () => {
            setUser(null);
            navigate('/login');
        };

        window.addEventListener('auth:expired', handleAuthExpired);
        return () => window.removeEventListener('auth:expired', handleAuthExpired);
    }, [navigate]);

    const login = (userData, token) => {
        if (token) localStorage.setItem('token', token);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
