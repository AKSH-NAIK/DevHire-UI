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
    const userStr = localStorage.getItem("user");
    let user = null;

    try {
      if (userStr && userStr !== "undefined") {
        user = JSON.parse(userStr);
      }
    } catch (e) {
      console.error("Invalid user in localStorage");
    }

    return user;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};