import { create } from "zustand";

export const useAuthStore = create((set) => ({

    user : null,
    setUser : (user) => set({ user }),

    loading : false,
    setLoading : (loading) => set({loading}),

    logoutUser : () => set({user : null})
}))