import { useCallback } from 'react';
import { DragDropContext, type OnDragStartResponder } from '@hello-pangea/dnd';
import KanbanColumn from '../KanbanColumn';
import { DragDropProvider, useDragDropContext } from '@/context/DragDropContext';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import type { Task } from '@/types';


interface KanbanBoardProps {
    tasks: Task[];
}

const BoardInner: React.FC<KanbanBoardProps> = ({ tasks }) => {
    const { setDragState } = useDragDropContext();
    const { columns, onDragEnd } = useDragAndDrop(tasks);

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
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

// Outer wrapper provides the context to BoardInner
const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => (
    <DragDropProvider>
        <BoardInner tasks={tasks} />
    </DragDropProvider>
);

export default KanbanBoard