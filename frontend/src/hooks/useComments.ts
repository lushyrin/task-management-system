import { commentService } from "@/services/comment.service"
import type { CreateCommentRequest, UpdateCommentRequest } from "@/types"
import { QUERY_KEYS } from "@/utils/constants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetCommentsByTaskId = (taskId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.COMMENTS.BY_TASK(taskId),
        queryFn: () => commentService.getByTaskId(taskId),
        enabled: !!taskId,
    })
}

export const useGetCommentById = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.COMMENTS.DETAIL(id),
        queryFn: () => commentService.getById(id),
        enabled: !!id,
    })
}

export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCommentRequest) => commentService.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS.BY_TASK(variables.taskId) })
        }
    })
}

export const useUpdateComment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCommentRequest }) => commentService.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS.BY_TASK(data.taskId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS.DETAIL(data.id) })
        }
    })
}

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, taskId }: { id: string; taskId: string }) =>
            commentService.delete(id).then(() => ({ id, taskId })),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS.BY_TASK(data.taskId) })
        }
    })
}

export default useGetCommentsByTaskId;