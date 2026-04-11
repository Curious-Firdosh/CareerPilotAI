import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AuthApi } from "../Services/auth.api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"


// 🔹 LOGIN
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.login,
        onSuccess: async () => {
            await queryClient.invalidateQueries(['getuserDetails']); // ✅ refetch real user
            toast.success("Login Successfully");
        },
        onError: (error) =>
            toast.error(error?.response?.data?.message || error.message),
    });
};

// 🔹 REGISTER
export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.register,
        onSuccess: async () => {
            await queryClient.invalidateQueries(['getuserDetails']); // ✅ refetch
            toast.success("Account Created Successfully");
        },
        onError: (error) =>
            toast.error(error?.response?.data?.message || error.message),
    });
};

// 🔹 GET ME
export const useGetme = () => {
    return useQuery({
        queryKey: ['getuserDetails'],
        queryFn: AuthApi.getme,
        retry: 1, // ✅ avoid instant logout on small failure
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};


// 🔹 LOGOUT
export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: AuthApi.logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries(['getuserDetails']); // ✅ clear auth state properly
            toast.success("Logout Successfully");
            navigate('/login');
        },
        onError: (error) =>
            toast.error(error?.response?.data?.message || error.message),
    });
};