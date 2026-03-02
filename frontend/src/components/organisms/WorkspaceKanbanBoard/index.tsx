import { useCallback } from 'react';
import { DragDropContext, type OnDragStartResponder } from '@hello-pangea/dnd';
import KanbanColumn from '../KanbanColumn';
import { DragDropProvider, useDragDropContext } from '@/context/DragDropContext';
import { useWorkspaceDragAndDrop } from '@/hooks/useWorkspaceDragAndDrop';
import { workspaceService } from '@/services/workspace.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { Task } from '@/types';

interface WorkspaceKanbanBoardProps {
    tasks: Task[];
    workspaceId: string;
}

const WORKSPACE_TASKS_KEY = (id: string) => ['workspaces', id, 'tasks'];

const BoardInner: React.FC<WorkspaceKanbanBoardProps> = ({ tasks, workspaceId }) => {
    const { setDragState } = useDragDropContext();
    const { columns, onDragEnd } = useWorkspaceDragAndDrop(tasks, workspaceId);
    const queryClient = useQueryClient();

    // Update task mutation
    const updateMutation = useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: { title?: string; description?: string } }) =>
            workspaceService.updateTask(workspaceId, taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_TASKS_KEY(workspaceId) });
            message.success('Task updated');
        },
        onError: (error: Error) => {
            message.error(error.message || 'Failed to update task');
        },
    });

    // Delete task mutation
    const deleteMutation = useMutation({
        mutationFn: (taskId: string) => workspaceService.deleteTask(workspaceId, taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_TASKS_KEY(workspaceId) });
            message.success('Task deleted');
        },
        onError: (error: Error) => {
            message.error(error.message || 'Failed to delete task');
        },
    });

    const handleUpdateTask = useCallback((taskId: string, data: { title?: string; description?: string }) => {
        updateMutation.mutate({ taskId, data });
    }, [updateMutation]);

    const handleDeleteTask = useCallback((taskId: string) => {
        deleteMutation.mutate(taskId);
    }, [deleteMutation]);

    // Tell the context which card is being dragged
    const onDragStart: OnDragStartResponder = useCallback(
        (start) => setDragState(start.draggableId),
        [setDragState]
    );

    // Clear drag state then run the hook's logic
    const handleDragEnd: typeof onDragEnd = useCallback(
        (result) => {
            setDragState(null);
            onDragEnd(result);
        },
        [onDragEnd, setDragState]
    );

    return (
        <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
            <div className="kanban-container">
                {columns.map(column => (
                    <KanbanColumn
                        key={column.id}
                        title={column.title}
                        status={column.id}
                        tasks={column.tasks}
                        droppableId={column.id}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        workspaceId={workspaceId}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

// Outer wrapper provides the context to BoardInner
const WorkspaceKanbanBoard: React.FC<WorkspaceKanbanBoardProps> = ({ tasks, workspaceId }) => (
    <DragDropProvider>
        <BoardInner tasks={tasks} workspaceId={workspaceId} />
    </DragDropProvider>
);

export default WorkspaceKanbanBoard;
