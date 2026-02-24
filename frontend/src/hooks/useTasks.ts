import { taskService } from "@/services/task.service"
import type { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types";
import { QUERY_KEYS } from "@/utils/constants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Optimized hook with caching
export const useGetTask = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.TASKS.ALL],
        queryFn: taskService.getAll,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

export const useGetTaskById = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.TASKS.DETAIL(id),
        queryFn: () => taskService.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useGetTaskStats = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.TASKS.STATS],
        queryFn: taskService.getStats,
        staleTime: 1 * 60 * 1000, // 1 minute
        retry: 1,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTaskRequest) => taskService.create(data),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS.ALL] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS.STATS] });
        }
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) => taskService.update(id, data),
        onSuccess: (updatedTask: Task) => {
            queryClient.setQueryData(QUERY_KEYS.TASKS.DETAIL(updatedTask.id), updatedTask);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS.ALL] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS.STATS] });
        }
    });
};

export const useDeletetask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => taskService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS.ALL] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS.STATS] });
        }
    });
};

export const useUpdateTaskOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskIds: string[]) => taskService.updateOrder({ taskIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS.ALL] });
        }
    });
};

interface UseTaskReturn {
    tasks: Task[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    createTask: ReturnType<typeof useCreateTask>;
    updateTask: ReturnType<typeof useUpdateTask>;
    deleteTask: ReturnType<typeof useDeletetask>;
    updateTaskOrder: ReturnType<typeof useUpdateTaskOrder>;
    getTaskById: (id: string) => ReturnType<typeof useGetTaskById>;
    useTaskStats: () => ReturnType<typeof useGetTaskStats>;
}

export const useTasks = (): UseTaskReturn => {
    const { data: tasks, isLoading, isError, error } = useGetTask();
    return {
        tasks,
        isLoading,
        isError,
        error,
        createTask: useCreateTask(),
        updateTask: useUpdateTask(),
        deleteTask: useDeletetask(),
        updateTaskOrder: useUpdateTaskOrder(),
        getTaskById: useGetTaskById,
        useTaskStats: useGetTaskStats
    };
};

export default useTasks;
