import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authService = {

  register: async (userData) => {
    const response = await api.post("/register", userData);
    return response.data;
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
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