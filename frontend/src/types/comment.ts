import type { User } from "./user";

export interface Comment {
    id: string;
    content: string;
    taskId: string;
    userId: string;
    user?: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentRequest {
    content: string;
    taskId: string;
}

export interface UpdateCommentRequest {
    content: string;
}