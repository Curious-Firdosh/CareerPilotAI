import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AuthApi } from "../Services/auth.api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"


export const useLogin = () => {

    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn: AuthApi.login,
        onSuccess: (data) => {
            queryClient.setQueryData(['getuserDetails'], data.user);
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
            queryClient.setQueryData(['getuserDetails'], data.user);
            toast.success("Account Created Successfully");
        },
        onError: (error) => toast.error(error?.response?.data?.message || error.message)
    })
    return result
}

export const useGetme = () => {
    return useQuery({
        queryKey: ['getuserDetails'],
        queryFn: AuthApi.getme,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 min cache
        refetchOnWindowFocus: false
    })
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