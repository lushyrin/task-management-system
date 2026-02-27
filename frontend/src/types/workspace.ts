import type { User } from "./user";
import type { Task } from "./task";

export type WorkspaceRole = "owner" | "member";

export interface WorkspaceMember {
    id: string;
    workspaceId: string;
    userId: string;
    user: User;
    role: WorkspaceRole;
    joinedAt: string;
}

export interface Workspace {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    owner: User;
    inviteCode: string;
    inviteExpiresAt: string | null;
    members: WorkspaceMember[];
    tasks?: Task[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkspacePayload {
    name: string;
    description?: string;
}

export interface UpdateWorkspacePayload {
    name: string;
    description?: string;
}

export interface JoinWorkspacePayload {
    inviteCode: string;
}

export interface CreateWorkspaceTaskPayload {
    title: string;
    description?: string;
    assigneeId?: string | null;
}

export interface AssignTaskPayload {
    assigneeId: string | null;
}