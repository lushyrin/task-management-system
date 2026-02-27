import api from "./api";
import type { Workspace, CreateWorkspacePayload, UpdateWorkspacePayload, JoinWorkspacePayload, CreateWorkspaceTaskPayload, AssignTaskPayload, Task } from '@/types';

export const workspaceService = {
    // --- Workspace CRUD ---
    getAll: async (): Promise<Workspace[]> => {
        const { data } = await api.get("/workspaces");
        return data;
    },

    getById: async (id: string): Promise<Workspace> => {
        const { data } = await api.get(`/workspaces/${id}`);
        return data;
    },

    create: async (payload: CreateWorkspacePayload): Promise<Workspace> => {
        const { data } = await api.post("/workspaces", payload);
        return data;
    },

    update: async (id: string, payload: UpdateWorkspacePayload): Promise<Workspace> => {
        const { data } = await api.put(`/workspaces/${id}`, payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/workspaces/${id}`);
    },

    // --- Invite ---
    join: async (payload: JoinWorkspacePayload): Promise<Workspace> => {
        console.log("Join workspace payload:", payload);
        const { data } = await api.post("/workspaces/join", payload);
        return data;
    },

    refreshInviteCode: async (id: string): Promise<{ inviteCode: string }> => {
        const { data } = await api.post(`/workspaces/${id}/invite/refresh`);
        return data;
    },

    // --- Members ---
    removeMember: async (workspaceId: string, userId: string): Promise<void> => {
        await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
    },

    // --- Tasks ---
    getTasks: async (workspaceId: string): Promise<Task[]> => {
        const { data } = await api.get(`/workspaces/${workspaceId}/tasks`);
        return data;
    },

    createTask: async (workspaceId: string, payload: CreateWorkspaceTaskPayload): Promise<Task> => {
        const { data } = await api.post(`/workspaces/${workspaceId}/tasks`, payload);
        return data;
    },

    assignTask: async (workspaceId: string, taskId: string, payload: AssignTaskPayload): Promise<Task> => {
        const { data } = await api.put(`/workspaces/${workspaceId}/tasks/${taskId}/assign`, payload);
        return data;
    },
};