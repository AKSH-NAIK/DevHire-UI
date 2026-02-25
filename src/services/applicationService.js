import axios from "axios";

const API_URL = "http://localhost:5000/api/applications";

export const applyToJob = async (jobId, resumeFile, phone, coverLetter) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", resumeFile);
    formData.append("phone", phone);
    formData.append("coverLetter", coverLetter);

    const response = await axios.post(API_URL, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getMyApplications = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/my`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getApplicationsForJob = async (jobId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/${applicationId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};