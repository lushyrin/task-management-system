import { authService } from "@/services/auth.service";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";
import { QUERY_KEYS, STORAGE_KEYS } from "@/utils/constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: ReturnType<typeof useLogin>;
    register: ReturnType<typeof useRegister>;
    logout: () => void;
}

export const useGetProfile = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.AUTH.PROFILE],
        queryFn: authService.getProfile,
        enabled: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: (data: AuthResponse) => {
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
            queryClient.setQueryData([QUERY_KEYS.AUTH.PROFILE], data.user);
        }
    })
}

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: (data: AuthResponse) => {
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
            queryClient.setQueryData([QUERY_KEYS.AUTH.PROFILE], data.user);
        }
    })
};

export const useAuth = (): UseAuthReturn => {
    const { data: user, isLoading } = useGetProfile();
    const login = useLogin();
    const register = useRegister();
    const queryClient = useQueryClient();

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        queryClient.clear();
        window.location.href = '/login'
    };

    return {
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    }
}