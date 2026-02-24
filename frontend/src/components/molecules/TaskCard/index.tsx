import { Card, Typography, Space, Avatar, Tooltip, Popconfirm } from 'antd';
import { MessageOutlined, ClockCircleOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { StatusBadge } from '@/components/atoms';
import type { Task } from '@/types';
import { formatDistanceToNow } from '@/utils/helpers';
import { useDeletetask } from '@/hooks/useTasks';

const { Text } = Typography;

interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
    const deleteTask = useDeletetask();

    const handleDelete = (e?: React.MouseEvent) => {
        e?.stopPropagation(); // prevent card click/navigate
        deleteTask.mutate(task.id);
    };
    return (
        <Card
            hoverable
            className="task-card animate-fade-in"
            onClick={() => onClick?.(task)}
            bodyStyle={{ padding: 16 }}>
            <Space direction="vertical" className="w-full" size={8}>
                {/* Status Badge */}
                <div className='flex items-center justify-between w-full'>
                    <StatusBadge status={task.status} />
                    <Popconfirm
                        title="Delete task"
                        description="Are you sure you want to delete this task?"
                        onConfirm={handleDelete}
                        onPopupClick={(e) => e.stopPropagation()}
                        okText="Delete"
                        okButtonProps={{ danger: true, loading: deleteTask.isPending }}
                        cancelText="Cancel"
                        placement="topRight"
                    >
                        <Tooltip title="Delete task">
                            <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 24,
                                    height: 24,
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    color: '#c70000',
                                    transition: 'all 0.15s',
                                }}
                                className="hover:bg-red-50 hover:text-red-400">
                                <DeleteOutlined style={{ fontSize: 13 }} />
                            </div>
                        </Tooltip>
                    </Popconfirm>
                </div>

                {/* Title */}
                <Text strong className="task-card-title block">
                    {task.title}
                </Text>

                {/* Description */}
                {task.description && (
                    <Text type="secondary" className="task-card-description block">
                        {task.description}
                    </Text>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Space size={12}>
                        {/* User Avatar */}
                        <Tooltip title={task.user?.username || 'Unknown'}>
                            <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                className="bg-blue-500"
                            >
                                {task.user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Tooltip>

                        {/* Comments Count */}
                        {task.comments && task.comments.length > 0 && (
                            <Space size={4} className="text-gray-400">
                                <MessageOutlined />
                                <Text type="secondary" className="text-xs">
                                    {task.comments.length}
                                </Text>
                            </Space>
                        )}
                    </Space>

                    {/* Created Time */}
                    <Space size={4} className="text-gray-400">
                        <ClockCircleOutlined className="text-xs" />
                        <Text type="secondary" className="text-xs">
                            {formatDistanceToNow(task.createdAt)}
                        </Text>
                    </Space>
                </div>
            </Space>
        </Card>
    );
};

export default TaskCard;
