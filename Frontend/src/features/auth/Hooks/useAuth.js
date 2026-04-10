import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AuthApi } from "../Services/auth.api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"


export const useLogin = () => {

    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn: AuthApi.login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getuserDetails'] });
            toast.success("Log In SuccessFully ")
        },
        onError: (error) => toast.error(error?.response?.data?.message || error.message)
    })
    return result
}

export const useRegister = () => {

     const queryClient = useQueryClient();

    const result = useMutation({
        mutationFn: AuthApi.register,
        onSuccess: (data) => {
            console.log(data.user);
            queryClient.invalidateQueries({ queryKey: ['getuserDetails'] });
            toast.success("Account Created SuccessFully ")
        },
        onError: (error) => toast.error(error?.response?.data?.message || error.message)
    })
    return result
}

export const useGetme = () => {

    const result = useQuery({
        queryKey: ['getuserDetails'],
        queryFn: AuthApi.getme,
        retry: false
    })
    return result
}

export const useLogout = () => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const result = useMutation({
        mutationFn: AuthApi.logout,
        onSuccess: (data) => {
            console.log(data.user);
            queryClient.removeQueries({ queryKey: ['getuserDetails'] });
            toast.success("Log Out SuccessFullly")
            navigate('/login')
            
        },
        onError: (error) => toast.error(error?.response?.data?.message || error.message)
    })
    return result
}