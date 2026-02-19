import useTasks from '@/hooks/useTasks';
import { AppstoreAddOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Radio, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import { TaskList } from '@/components/organisms';

const { Title } = Typography;
type ViewMode = 'list' | 'grid'

const Tasks: React.FC = () => {
    const navigate = useNavigate()
    const { tasks, isLoading } = useTasks()
    const [ViewMode, setViewMode] = useState<ViewMode>('grid')

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

                        <Button variant='primary' size='md' rounded='md' icon={<PlusOutlined />} onClick={() => navigate('/tasks/new')}>
                            Add Task
                        </Button>
                    </Space>
                </div>
            </div>
            <TaskList tasks={tasks || []} isLoading={isLoading} viewMode={ViewMode} />
        </div>
    )
};

export default Tasks;
