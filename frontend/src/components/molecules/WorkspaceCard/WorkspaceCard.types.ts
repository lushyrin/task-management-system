import type { Workspace } from '@/types';

export interface WorkspaceCardProps {
    workspace: Workspace;
    isActive?: boolean;
    onClick?: () => void;
}
