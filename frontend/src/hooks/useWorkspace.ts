import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { workspaceService } from "../services/workspace.service";
import type { CreateWorkspacePayload, UpdateWorkspacePayload, JoinWorkspacePayload, CreateWorkspaceTaskPayload, AssignTaskPayload } from "@/types";
export const WORKSPACE_KEYS = {
    all: ["workspaces"] as const,
    detail: (id: string) => ["workspaces", id] as const,
    tasks: (id: string) => ["workspaces", id, "tasks"] as const,
};

// --- Queries ---

export const useWorkspaces = () =>
    useQuery({
        queryKey: WORKSPACE_KEYS.all,
        queryFn: workspaceService.getAll,
    });

export const useWorkspace = (id: string) =>
    useQuery({
        queryKey: WORKSPACE_KEYS.detail(id),
        queryFn: () => workspaceService.getById(id),
        enabled: !!id,
    });

export const useWorkspaceTasks = (workspaceId: string) =>
    useQuery({
        queryKey: WORKSPACE_KEYS.tasks(workspaceId),
        queryFn: () => workspaceService.getTasks(workspaceId),
        enabled: !!workspaceId,
    });

// --- Mutations ---

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateWorkspacePayload) =>
            workspaceService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
            message.success("Workspace created!");
        },
        onError: (err: Error) => {
            message.error(err.message || "Failed to create workspace");
        },
    });
};

export const useUpdateWorkspace = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateWorkspacePayload) =>
            workspaceService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
            message.success("Workspace updated!");
        },
        onError: (err: Error) => {
            message.error(err.message || "Failed to update workspace");
        },
    });
};

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => workspaceService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
            message.success("Workspace deleted");
        },
        onError: (err: Error) => {
            message.error(err.message || "Failed to delete workspace");
        },
    });
};

export const useJoinWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: JoinWorkspacePayload) =>
            workspaceService.join(payload),
        onSuccess: (workspace) => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
            message.success(`Joined "${workspace.name}"!`);
        },
        onError: (err: Error) => {
            message.error(err.message || "Invalid invite code");
        },
    });
};

export const useRefreshInviteCode = (workspaceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => workspaceService.refreshInviteCode(workspaceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.detail(workspaceId) });
            message.success("Invite code refreshed");
        },
        onError: (err: Error) => {
            message.error(err.message || "Failed to refresh invite code");
        },
    });
};

export const useRemoveMember = (workspaceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) =>
            workspaceService.removeMember(workspaceId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.detail(workspaceId) });
            message.success("Member removed");
        },
        onError: (err: Error) => {
            message.error(err.message || "Failed to remove member");
        },
    });
};

export const useCreateWorkspaceTask = (workspaceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateWorkspaceTaskPayload) =>
            workspaceService.createTask(workspaceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.tasks(workspaceId) });
            message.success("Task created!");
        },
        onError: (err: Error) => {
            message.error(err.message || "Failed to create task");
        },
    });
};

export const useAssignTask = (workspaceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, payload }: { taskId: string; payload: AssignTaskPayload }) =>
            workspaceService.assignTask(workspaceId, taskId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.tasks(workspaceId) });
            message.success("Task assigned!");
        },
        onError: (err: Error) => {
            message.error(err.message || "Failed to assign task");
        },
    });
};