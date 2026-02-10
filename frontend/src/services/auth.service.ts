import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";
import api from "./api";

export const authService = {
    //regist
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data
    },
    //login
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },
    //get current profile
    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/profile');
        return response.data
    },
};