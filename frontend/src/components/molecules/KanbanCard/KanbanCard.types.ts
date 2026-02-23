import type { Task } from '@/types';
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

export interface KanbanCardProps {
    task: Task;
    isDragging?: boolean;
    dragHandleProps?: DraggableProvidedDragHandleProps | null;
}
