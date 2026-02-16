import { useEffect, useState } from 'react';
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

// Parse user from localStorage safely
const getStoredUser = (): User | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

// Check if token exists
const hasToken = (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const useGetProfile = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.AUTH.PROFILE],
        queryFn: authService.getProfile,
        enabled: hasToken(),
        // Use stored user as initial data for instant render
        initialData: getStoredUser(),
        // Don't refetch on window focus for auth
        refetchOnWindowFocus: false,
        // Short stale time to keep data fresh but not block UI
        staleTime: 5 * 60 * 1000,
        // Retry only once on failure, quickly
        retry: 1,
        retryDelay: 1000,
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: (data: AuthResponse) => {
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
            queryClient.setQueryData([QUERY_KEYS.AUTH.PROFILE], data.user);
        }
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: (data: AuthResponse) => {
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
            queryClient.setQueryData([QUERY_KEYS.AUTH.PROFILE], data.user);
        }
    });
};

// Fast auth hook that doesn't wait for API if we have local data
export const useAuth = (): UseAuthReturn => {
    const { data: user, isLoading } = useGetProfile();
    const login = useLogin();
    const register = useRegister();
    const queryClient = useQueryClient();
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    // Check local storage immediately on mount
    useEffect(() => {
        setInitialCheckDone(true);
    }, []);

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        queryClient.clear();
        window.location.href = '/login';
    };

    // If we have initial data from localStorage, consider auth check done
    const isEffectivelyLoading = isLoading && !user && !initialCheckDone;

    return {
        user: user || null,
        isLoading: isEffectivelyLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };
};
