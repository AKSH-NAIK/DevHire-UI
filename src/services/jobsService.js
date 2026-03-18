import api from "./api";
import axios from "axios";

export const jobsService = {
  // Get all jobs
  getAllJobs: async (filters = {}) => {
    const response = await api.get("/jobs", {
      params: filters
    });
    return response.data;
  },

  // Get recruiter's jobs
  getMyJobs: async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get("https://devhire-backend-1.onrender.com/api/jobs/my-jobs", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  // Get single job by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job (Recruiter only)
  createJob: async (jobData) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  // Update job
  updateJob: async (jobId, updates) => {
    const response = await api.put(`/jobs/${jobId}`, updates);
    return response.data;
  },

  // Delete job
  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  }
};