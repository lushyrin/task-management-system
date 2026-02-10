import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';
import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
)
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<{ error?: string; message?: string }>) => {
        if (error.response?.status === 401) {
            //clear token, redirect login
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            window.location.href = '/login';
        }

        const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
        return Promise.reject(new Error(errorMessage));
    }
);

export default api;
