import api from "./api";

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Registration failed"
      );
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      // Pass the backend message directly
      throw new Error(
        error.response?.data?.message || "Login failed"
      );
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};