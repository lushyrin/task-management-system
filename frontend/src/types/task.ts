import type { User } from "./user";
import type { Comment } from "./comment";

export type TaskStatus = 'not-started' | 'in-progress' | 'done';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    order: number;
    userId: string;
    user?: User;
    comments?: Comment[]
    createdAt: string;
    updatedAt: string;
}

export interface TaskStats {
    total: number;
    notStarted: number;
    inProgress: number;
    done: number;
    percent: number;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status?: TaskStatus;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
    order?: number;
}

export interface UpdateTaskOrderRequest {
    taskIds: string[];
}