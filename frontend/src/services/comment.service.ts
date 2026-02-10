import api from './api'
import type { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types';

export const commentService = {
    //get all comment dari 1 task
    getByTaskId: async (taskId: string): Promise<Comment[]> => {
        const response = await api.get<Comment[]>(`/comments/task/${taskId}`);
        return response.data;
    },
    //get comment by id
    getById: async (id: string): Promise<Comment> => {
        const response = await api.get<Comment>(`/comment/${id}`);
        return response.data;
    },
    //create
    create: async (data: CreateCommentRequest): Promise<Comment> => {
        const response = await api.post<Comment>('/comments', data);
        return response.data;
    },
    //update
    update: async (id: string, data: UpdateCommentRequest): Promise<Comment> => {
        const response = await api.put<Comment>(`/comments/${id}`, data);
        return response.data;
    },
    //detele
    delete: async (id: string): Promise<void> => {
        await api.delete(`/comments/${id}`);
    },
};