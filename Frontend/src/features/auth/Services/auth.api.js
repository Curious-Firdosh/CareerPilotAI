import axiosInstance from "../../../lib/axios"


export const  AuthApi = {
    login : async (data) => {
        const  response = await axiosInstance.post('/auth/login', data)
        return response.data.user
    },
    register : async (data) => {
        const response = await axiosInstance.post('/auth/register' , data)
        return response.data.user
    },
    getme : async () => {
        const response = await axiosInstance.get('/auth/getme')
        return response.data.data
    },
    logout : async () => {
        const response = await axiosInstance.get('/auth/logout')
        return response.data
    }
}