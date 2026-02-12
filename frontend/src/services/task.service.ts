import api from './api'
import type { CreateTaskRequest, Task, TaskStats, UpdateTaskRequest } from "@/types";

export const taskService = {
    //get all task
    getAll: async (): Promise<Task[]> => {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },
    //get task by ID
    getById: async (id: string): Promise<Task> => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },
    //create
    create: async (data: CreateTaskRequest): Promise<Task> => {
        const response = await api.post<Task>('/tasks', data);
        return response.data;
    },
    //update task
    update: async (id: string, data: UpdateTaskRequest): Promise<Task> => {
        const response = await api.put<Task>(`/tasks/${id}`, data);
        return response.data
    },
    //delete task
    delete: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`)
    },
    //get task sats
    getStats: async (): Promise<TaskStats> => {
        const response = await api.get<TaskStats>('/task/stats');
        return response.data;
    },
    //update order
    updateOrder: async (data: { taskIds: string[] }): Promise<void> => {
        await api.put('/tasks/order', data);
    }
}