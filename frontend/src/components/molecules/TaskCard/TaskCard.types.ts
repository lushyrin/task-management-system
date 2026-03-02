import type { Task } from '@/types';

export interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
    viewMode?: 'grid' | 'list';
    showPriority?: boolean;
    showAssignee?: boolean;
    workspaceId?: string;
}
