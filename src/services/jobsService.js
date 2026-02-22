import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

/**
 * All functions now communicate with backend.
 * No more localStorage.
 */

export const jobsService = {

  // ─────────────────────────────────────────────
  // Get all jobs
  // ─────────────────────────────────────────────
  getAllJobs: async (filters = {}) => {
    const response = await axios.get(API_URL, {
      params: filters
    });

    return response.data;
  },

  // ─────────────────────────────────────────────
  // Get single job by ID
  // ─────────────────────────────────────────────
  getJobById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // ─────────────────────────────────────────────
  // Create job (Recruiter only)
  // ─────────────────────────────────────────────
  createJob: async (jobData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(API_URL, jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // ─────────────────────────────────────────────
  // Update job
  // ─────────────────────────────────────────────
  updateJob: async (jobId, updates) => {
    const token = localStorage.getItem("token");

    const response = await axios.put(`${API_URL}/${jobId}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // ─────────────────────────────────────────────
  // Delete job
  // ─────────────────────────────────────────────
  deleteJob: async (jobId) => {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${API_URL}/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
};