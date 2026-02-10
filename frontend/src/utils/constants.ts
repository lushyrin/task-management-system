export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const TASK_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    DONE: 'done'
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const QUERY_KEYS = {
    AUTH: {
        USER: 'user',
        PROFILE: 'profile'
    },
    TASKS: {
        ALL: 'tasks',
        DETAIL: (id: string) => ['tasks', id],
        STATS: 'taskStats'
    },
    COMMENTS: {
        BY_TASK: (taskId: string) => ['comments', taskId],
        DETAIL: (id: string) => ['comments', id]
    }

} as const;

export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user'
} as const