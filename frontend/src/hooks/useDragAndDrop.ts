
import { taskService } from "@/services/task.service"
import type { Task, TaskStatus } from "@/types"
import type { DropResult } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from 'antd';
import { useState, useCallback } from 'react';

const TASK_QUERY_KEY = ['tasks']

interface ColumnData {
    id: TaskStatus
    title: string
    tasks: Task[]
}

const COLUMN_DEF: { id: TaskStatus; title: string }[] = [
    { id: 'not_started', title: "Not Started" },
    { id: 'in_progress', title: 'In Proress' },
    { id: 'done', title: 'Done' }
]

const STATUS_MESSAGES: Record<TaskStatus, string> = {
    not_started: 'Task Moved to Not Started',
    in_progress: 'Task Moved to In Progress',
    done: 'Task Moved to Done'
}

function buildColumns(tasks: Task[]): ColumnData[] {
    return COLUMN_DEF.map(def => ({
        ...def,
        tasks: tasks.filter(t => t.status === def.id).sort((a, b) => a.order - b.order)
    }))
}

function computeNewOrder(columnTasks: Task[], destinationIndex: number): number {
    if (columnTasks.length === 0) return 0;
    if (destinationIndex === 0)
        return (columnTasks[0]?.order ?? 0) - 1000;
    if (destinationIndex >= columnTasks.length)
        return (columnTasks[columnTasks.length - 1]?.order ?? 0) + 1000;

    const prev = columnTasks[destinationIndex - 1]?.order ?? 0;
    const next = columnTasks[destinationIndex]?.order ?? 0;
    return (prev + next) / 2;
}

export function useDragAndDrop(tasks: Task[]) {
    const queryClient = useQueryClient()

    const [optimisticTasks, setOptimisticTasks] = useState<Task[] | null>(null)
    const activeTasks = optimisticTasks ?? tasks
    const columns = buildColumns(activeTasks)
    const { mutate: moveTask, isPending } = useMutation({
        mutationFn: ({ taskId, newStatus, newOrder }: { taskId: string; newStatus: TaskStatus; newOrder: number }) => taskService.update(taskId, { status: newStatus, order: newOrder }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
            setOptimisticTasks(null);
        },
        onError: (error: Error) => {
            // Roll back optimistic update
            setOptimisticTasks(null);
            queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
            message.error(error.message || 'Failed to move task. Please try again.');
        },
    });

    const onDragEnd = useCallback(
        (result: DropResult) => {
            const { destination, source, draggableId } = result;

            if (!destination) return;
            if (destination.droppableId === source.droppableId && destination.index == source.index)
                return;
            const newStatus = destination.droppableId as TaskStatus;
            const currentColumns = buildColumns(activeTasks)
            const destColumnTasks = currentColumns.find(c => c.id === newStatus)?.tasks.filter(t => t.id !== draggableId) ?? []
            const newOrder = computeNewOrder(destColumnTasks, destination.index)

            setOptimisticTasks(prev => {
                const base = prev ?? tasks
                return base.map(t => t.id == draggableId ? { ...t, status: newStatus, order: newOrder } : t
                )
            })

            moveTask({ taskId: draggableId, newStatus, newOrder })
            message.success(STATUS_MESSAGES[newStatus])
        },
        [activeTasks, tasks, moveTask]

    )

    return {
        columns,
        onDragEnd,
        isDragging: isPending,
    }
}

