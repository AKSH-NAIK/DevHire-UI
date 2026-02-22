import axios from "axios";

const API_URL = "http://localhost:5000/api/applications";

export const applyToJob = async (jobId, resumeFile) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", resumeFile);

    const response = await axios.post(API_URL, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};