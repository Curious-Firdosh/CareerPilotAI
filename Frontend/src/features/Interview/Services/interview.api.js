
import axiosInstance from "../../../lib/axios";


export const InterviewApi = {
    
    generateReport: async ({ jobDescription, selfDescription, resume }) => {

        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);
        formData.append("resume", resume);

        const response = await axiosInstance.post('/interview', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data
    },
    getAllReports: async () => {
        const response = await axiosInstance.get('/interview')
        return response.data
    },
    getInterviewReportById: async (id) => {
        const response = await axiosInstance.get(`/interview/report/${id}`)
        return response.data
    },
    generateReportPdf : async (id) => {
        const response = await axiosInstance.post(`/interview/pdf/${id}`, null , {
            responseType: 'blob'
        })
        
        return response.data
    }
}