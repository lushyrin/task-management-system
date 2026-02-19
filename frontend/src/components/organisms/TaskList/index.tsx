import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Empty, Pagination, Space, Select, Typography, Table, Avatar, Tooltip } from 'antd';
import { MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { TaskCard } from '@/components/molecules';
import { StatusBadge } from '@/components/atoms';
import type { Task, TaskStatus } from '@/types';
import { formatDistanceToNow } from '@/utils/helpers';

const { Text } = Typography;
const { Option } = Select;

interface TaskListProps {
    tasks: Task[];
    isLoading?: boolean;
    viewMode?: 'grid' | 'list';
    onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading = false,
    viewMode = 'grid',
}) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

    // Filter tasks by status
    const filteredTasks = statusFilter === 'all'
        ? tasks
        : tasks.filter(task => task.status === statusFilter);

    // Pagination
    const total = filteredTasks.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    const handleTaskClick = (task: Task) => {
        navigate(`/tasks/${task.id}`);
    };

    // Table columns definition
    const columns = [
        {
            title: 'Status',
            dataIndex: 'status',
            width: 110,
            render: (status: TaskStatus) => <StatusBadge status={status} />
        },
        {
            title: 'Title',
            dataIndex: 'title',
            render: (text: string, task: Task) => (
                <div style={{ minWidth: 200 }}>
                    <div style={{ fontWeight: 500, marginBottom: task.description ? 4 : 0 }}>{text}</div>
                    {task.description && (
                        <div style={{ 
                            color: '#9ca3af', 
                            fontSize: '0.75rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {task.description}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            width: 90,
            align: 'center' as const,
            render: (comments: any[]) => comments?.length > 0 ? (
                <Space size={4} style={{ color: '#9ca3af' }}>
                    <MessageOutlined />
                    <span>{comments.length}</span>
                </Space>
            ) : '—'
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            width: 130,
            render: (date: string) => (
                <Space size={4} style={{ color: '#9ca3af' }}>
                    <ClockCircleOutlined style={{ fontSize: '0.75rem' }} />
                    <span style={{ fontSize: '0.875rem' }}>
                        {formatDistanceToNow(date)}
                    </span>
                </Space>
            )
        },
        {
            title: 'Assignee',
            dataIndex: 'user',
            width: 80,
            align: 'center' as const,
            render: (user: any) => (
                <Tooltip title={user?.username || 'Unknown'}>
                    <Avatar 
                        size="small" 
                        style={{ 
                            backgroundColor: '#fef08a',
                            color: '#713f12',
                            fontWeight: 600
                        }}
                    >
                        {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                </Tooltip>
            )
        }
    ];

    if (!isLoading && tasks.length === 0) {
        return (
            <Empty
                description="No tasks yet"
                className="py-12"
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between mb-4">
                <Text type="secondary">
                    Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                </Text>
                <Space>
                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 140 }}
                        placeholder="Filter by status"
                    >
                        <Option value="all">All Status</Option>
                        <Option value="not_started">Not Started</Option>
                        <Option value="in_progress">In Progress</Option>
                        <Option value="done">Done</Option>
                    </Select>
                </Space>
            </div>

            {/* Task List - Grid or Table View */}
            {viewMode === 'list' ? (
                <Table
                    dataSource={paginatedTasks}
                    rowKey="id"
                    loading={isLoading}
                    pagination={false}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    onRow={(task) => ({
                        onClick: () => handleTaskClick(task),
                        style: { cursor: 'pointer' }
                    })}
                    rowClassName="hover:bg-gray-50"
                />
            ) : (
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 3,
                    }}
                    dataSource={paginatedTasks}
                    loading={isLoading}
                    renderItem={(task) => (
                        <List.Item>
                            <TaskCard
                                task={task}
                                onClick={handleTaskClick}
                            />
                        </List.Item>
                    )}
                />
            )}

            {/* Pagination */}
            {total > pageSize && (
                <div className="flex justify-center pt-4">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={setCurrentPage}
                        showSizeChanger
                        onShowSizeChange={(_, size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default TaskList;
