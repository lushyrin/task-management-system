import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Badge, Typography } from 'antd';
import { KanbanCard } from '@/components/molecules';
import type { Task, TaskStatus } from '@/types';

const { Text } = Typography;

interface KanbanColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    droppableId: string;
}

const columnColors: Record<TaskStatus, { dot: string; bg: string }> = {
    not_started: {
        dot: '#9ca3af',
        bg: '#f3f4f6',
    },
    in_progress: {
        dot: '#eab308',
        bg: '#fefce8',
    },
    done: {
        dot: '#22c55e',
        bg: '#f0fdf4',
    },
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
    title,
    status,
    tasks,
    droppableId,
}) => {
    const colors = columnColors[status];

    return (
        <div
            className="kanban-column"
            style={{
                background: colors.bg,
                borderRadius: '12px',
                padding: '14px',
                border: '1px solid #e5e5e5',
            }}>
            <div
                className="kanban-column-header"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
            >
                <Text
                    strong
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#525252',
                    }}>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: colors.dot,
                        }}
                    />
                    {title}
                    <Badge
                        count={tasks.length}
                        showZero
                        style={{
                            backgroundColor: tasks.length > 0 ? '#d4d4d4' : '#e5e5e5',
                            color: tasks.length > 0 ? '#525252' : '#a3a3a3',
                            fontSize: '11px',
                            fontWeight: 600,
                            boxShadow: 'none',
                            marginLeft: '8px'
                        }}
                    />
                </Text>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={droppableId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            minHeight: '200px',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            background: snapshot.isDraggingOver ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                            border: snapshot.isDraggingOver ? '2px dashed #facc15' : '2px dashed transparent',
                            padding: '4px',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(dragProvided, dragSnapshot) => (
                                        <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                                            <KanbanCard
                                                task={task}
                                                isDragging={dragSnapshot.isDragging}
                                                dragHandleProps={dragProvided.dragHandleProps ?? undefined}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </div>
                        {provided.placeholder}

                        {tasks.length === 0 && !snapshot.isDraggingOver && (
                            <div style={{
                                display: 'flex',
                                alignContent: 'center',
                                justifyContent: 'center',
                                minHeight: '120px',
                                color: '#d4d4d4',
                                fontSize: '13px',
                                flexDirection: 'column', gap: '6px'
                            }}>
                                <span style={{ fontSize: '22px' }}>+</span>
                                Drop Tasks Here
                            </div>
                        )}

                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
