import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Empty, Pagination, Space, Select, Typography, Table, Dropdown, Modal } from 'antd';
import { MessageOutlined, ClockCircleOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { TaskCard } from '@/components/molecules';
import { StatusBadge } from '@/components/atoms';
import { useDeletetask } from '@/hooks/useTasks';
import type { Task, TaskStatus } from '@/types';
import { formatDistanceToNow } from '@/utils/helpers';

const { Text } = Typography;
const { Option } = Select;

const colors = {
    text: '#171717',
    textMuted: '#9ca3af',
    textLight: '#a3a3a3',
    accent: '#eab308',
    white: '#ffffff',
};

interface TaskListProps {
    tasks: Task[];
    isLoading?: boolean;
    viewMode?: 'grid' | 'list';
}

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading = false,
    viewMode = 'grid',
}) => {
    const navigate = useNavigate();
    const deleteTask = useDeletetask();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

    const filteredTasks = statusFilter === 'all'
        ? tasks
        : tasks.filter(task => task.status === statusFilter);

    const total = filteredTasks.length;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

    const handleTaskClick = (task: Task) => {
        navigate(`/tasks/${task.id}`);
    };

    const handleDelete = (task: Task) => {
        Modal.confirm({
            title: 'Delete task',
            content: 'Are you sure you want to delete this task?',
            okText: 'Delete',
            okButtonProps: { danger: true, loading: deleteTask.isPending },
            cancelText: 'Cancel',
            onOk: () => deleteTask.mutate(task.id),
        });
    };

    const buildDropdownItems = (task: Task) => [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: () => navigate(`/tasks/${task.id}`),
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
            onClick: () => handleDelete(task),
        },
    ];

    const columns = [
        {
            title: 'Status',
            dataIndex: 'status',
            width: 130,
            render: (status: TaskStatus) => <StatusBadge status={status} />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            render: (text: string, task: Task) => (
                <div style={{ minWidth: 200, maxWidth: 480 }}>
                    <div style={{ fontWeight: 500, color: colors.text }}>{text}</div>
                    <div style={{
                        color: colors.textMuted,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        visibility: task.description ? 'visible' : 'hidden',
                    }}>
                        {task.description || '\u00A0'}
                    </div>
                </div>
            ),
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            width: 90,
            align: 'center' as const,
            render: (comments: any[]) => comments?.length > 0 ? (
                <Space size={4} style={{ color: colors.textMuted }}>
                    <MessageOutlined />
                    <span>{comments.length}</span>
                </Space>
            ) : '—',
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            width: 130,
            render: (date: string) => (
                <span style={{ color: colors.textMuted, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    <ClockCircleOutlined style={{ fontSize: '0.75rem', marginRight: 4 }} />
                    {formatDistanceToNow(date)}
                </span>
            ),
        },

        {
            // Replaces Assignee column — actions dropdown
            title: '',
            key: 'actions',
            width: 50,
            align: 'center' as const,
            render: (_: any, task: Task) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                        menu={{ items: buildDropdownItems(task) }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <div
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 28, height: 28, borderRadius: 6,
                                cursor: 'pointer', color: colors.textLight,
                                margin: '0 auto',
                            }}
                            className="hover:bg-gray-100"
                        >
                            <EllipsisOutlined style={{ fontSize: 16 }} />
                        </div>
                    </Dropdown>
                </div>
            ),
        },
    ];

    if (!isLoading && tasks.length === 0) {
        return <Empty description="No tasks yet" className="py-12" />;
    }

    return (
        <div className="space-y-4">
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
                        style: { cursor: 'pointer' },
                    })}
                    rowClassName="hover:bg-gray-50"
                />
            ) : (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
                    dataSource={paginatedTasks}
                    loading={isLoading}
                    renderItem={(task) => (
                        <List.Item>
                            <TaskCard task={task} onClick={handleTaskClick} />
                        </List.Item>
                    )}
                />
            )}

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