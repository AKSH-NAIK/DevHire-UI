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
    try {
      const userStr = localStorage.getItem("user");
      
      // Handle cases where userStr is null, undefined, or the literal strings "null"/"undefined"
      if (!userStr || userStr === "undefined" || userStr === "null") {
        return null;
      }

      return JSON.parse(userStr);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      // Clear corrupt data to prevent future crashes
      localStorage.removeItem("user");
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};