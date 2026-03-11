import type { Task } from "./task";

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    tasks?: Task[];
    plan: 'free' | 'pro';
    planExpiresAt: string | null;
}

export interface AuthResponse {
    token: string;
    user: User;
}
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string
}