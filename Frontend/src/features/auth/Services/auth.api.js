import axiosInstance from "../../../lib/axios"


export const  AuthApi = {
    login : async (data) => {
        const  response = await axiosInstance.post('/auth/login', data)
        console.log(response.data);
        
        return response.data
    },
    register : async (data) => {
        const response = await axiosInstance.post('/auth/register' , data)
        return response.data
    },
    getme : async () => {
        const response = await axiosInstance.get('/auth/getme')
        console.log(response.data.data);
        return response.data.data
    },
    logout : async () => {
        const response = await axiosInstance.get('/auth/logout')
        return response.data
    }
}