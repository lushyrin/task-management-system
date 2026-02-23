import { useState } from 'react';
import { Typography, Spin, message } from 'antd';
import { KanbanBoard } from '@/components/organisms';
import { useTasks } from '@/hooks/useTasks';
import type { TaskStatus } from '@/types';

const { Title } = Typography;

const Kanban: React.FC = () => {
    const { tasks, isLoading, updateTask } = useTasks();
    const [updating, setUpdating] = useState(false);

    const handleTaskMove = async (taskId: string, newStatus: TaskStatus, newOrder: number) => {
        if (updating) return;

        setUpdating(true);
        try {
            await updateTask.mutateAsync({
                id: taskId,
                data: { status: newStatus, order: newOrder }
            });

            const statusMessages: Record<TaskStatus, string> = {
                not_started: 'Task moved to Not Started',
                in_progress: 'Task moved to In Progress',
                done: 'Task completed',
            };
            message.success(statusMessages[newStatus]);
        } catch (error) {
            message.error('Failed to move task');
        } finally {
            setUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <Title
                        level={2}
                        style={{
                            margin: 0,
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            color: '#171717',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Kanban Board
                    </Title>
                </div>
                <p style={{
                    margin: 0,
                    color: '#737373',
                    fontSize: '0.95rem',
                }}>
                    Drag and drop tasks to organize your workflow
                </p>
            </div>

            {/* Kanban Board */}
            <KanbanBoard
                tasks={tasks || []}
                onTaskMove={handleTaskMove}
            />
        </div>
    );
};

export default Kanban;
