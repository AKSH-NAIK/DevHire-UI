import api from "./api";

export const applyToJob = async (jobId, resumeFile, phone, coverLetter) => {
    const formData = new FormData();

    formData.append("jobId", jobId);
    formData.append("resume", resumeFile);
    formData.append("phone", phone);
    formData.append("coverLetter", coverLetter);

    const response = await api.post("/applications/apply", formData, {
        headers: {
            "Content-Type": undefined,
        },
    });

    return response.data;
};

export const getMyApplications = async () => {
    const response = await api.get("/applications/my");
    return response.data?.applications || response.data || [];
};

export const getApplicationsForJob = async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data?.applications || response.data || [];
};

export const updateApplicationStatus = async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
};