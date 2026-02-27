import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Space, Alert, Spin, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { taskService } from '@/services/task.service';
import { QUERY_KEYS } from '@/utils/constants';
import KanbanBoard from '@/components/organisms/KanbanBoard';
import { TaskForm } from '@/components/organisms';
import { useCreateTask } from '@/hooks/useTasks';
import Button from '@/components/atoms/Button';
import type { CreateTaskRequest, UpdateTaskRequest } from '@/types';

const { Title, Text } = Typography;

const Kanban: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const createTask = useCreateTask();

    const {
        data: tasks = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [QUERY_KEYS.TASKS.ALL],
        queryFn: taskService.getAll,
        staleTime: 30_000,
    });

    const handleCreate = async (data: CreateTaskRequest | UpdateTaskRequest) => {
        createTask.mutate(data as CreateTaskRequest, {
            onSuccess: () => {
                setModalOpen(false)
            },
            onError: () => {
                message.error('Failed to create task.')
            },
        })
    }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    type="error"
                    showIcon
                    message="Failed to load tasks"
                    description={(error as Error)?.message ?? 'Unknown error'}
                    action={
                        <Button size="sm" icon={<ReloadOutlined />} onClick={() => refetch()}>
                            Retry
                        </Button>
                    }
                />
            </div >
        )
    }

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <div>
                        <Title
                            level={2}
                            style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', }}>
                            Kanban Board
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {tasks.length} task{tasks.length !== 1 ? 's' : ''} · drag cards to update status
                        </Text>
                    </div>
                    <Space size='middle'>
                        <Button variant='primary' size='md' rounded='md' icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                            Add Task
                        </Button>
                    </Space>
                </div>
            </div>
            <KanbanBoard tasks={tasks} />
            <TaskForm
                visible={modalOpen}
                onCancel={() => setModalOpen(false)}
                onSubmit={handleCreate}
                isLoading={createTask.isPending}
            />
        </div>
    );
};

export default Kanban;
