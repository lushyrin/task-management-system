import useTasks from '@/hooks/useTasks';
import { AppstoreAddOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Radio, Space, Typography, message } from 'antd';
import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import { TaskForm, TaskList } from '@/components/organisms';
import type { CreateTaskRequest, UpdateTaskRequest } from '@/types';

const { Title } = Typography;
type ViewMode = 'list' | 'grid'

const Tasks: React.FC = () => {
    const { tasks, isLoading, createTask } = useTasks()
    const [ViewMode, setViewMode] = useState<ViewMode>('grid')
    const [modalOpen, setModalOpen] = useState(false)
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

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <Title level={2} style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#171717' }}>
                            Tasks
                        </Title>
                        <p style={{ margin: '4px 0 0 0', color: '#737373', fontSize: '0.95rem' }}>
                            Manage and track all your task
                        </p>
                    </div>

                    <Space size='middle'>
                        <Radio.Group value={ViewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle='solid'>
                            <Radio.Button value='grid'>
                                <AppstoreAddOutlined />
                            </Radio.Button>
                            <Radio.Button value='list'>
                                <UnorderedListOutlined />
                            </Radio.Button>
                        </Radio.Group>

                        <Button variant='primary' size='md' rounded='md' icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                            Add Task
                        </Button>
                    </Space>
                </div>
            </div>
            <TaskList tasks={tasks || []} isLoading={isLoading} viewMode={ViewMode} />
            <TaskForm visible={modalOpen} onCancel={() => setModalOpen(false)} onSubmit={handleCreate} isLoading={createTask.isPending} />
        </div>
    )
};

export default Tasks;
