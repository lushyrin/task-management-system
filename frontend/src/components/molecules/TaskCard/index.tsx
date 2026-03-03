import { Card, Space, Avatar, Tooltip, Dropdown, Modal, Tag } from 'antd';
import { MessageOutlined, ClockCircleOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { Task, TaskStatus, TaskPriority } from '@/types';
import { formatDistanceToNow } from '@/utils/helpers';
import { useDeletetask } from '@/hooks/useTasks';
import { useNavigate } from 'react-router-dom';

const colors = {
    text: '#171717',
    textMuted: '#737373',
    textLight: '#a3a3a3',
    accent: '#eab308',
    border: '#e5e5e5',
    bg: '#fafafa',
    bgHover: '#f5f5f5',
    white: '#ffffff',
};

const PRIORITY_CONFIG: Record<TaskPriority, { bg: string; color: string; label: string }> = {
    high: { bg: '#FEE2E2', color: '#DC2626', label: 'High' },
    medium: { bg: '#FEF3C7', color: '#D97706', label: 'Medium' },
    low: { bg: '#D1FAE5', color: '#059669', label: 'Low' },
};

const STATUS_CONFIG: Record<TaskStatus, { color: string; icon: React.ReactNode; label: string }> = {
    not_started: { color: "default", icon: <MinusCircleOutlined />, label: "Not Started" },
    in_progress: { color: "processing", icon: <ClockCircleOutlined />, label: "In Progress" },
    done: { color: "success", icon: <CheckCircleOutlined />, label: "Done" },
};

interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
    viewMode?: 'grid' | 'list';
    showPriority?: boolean;
    showAssignee?: boolean;
    workspaceId?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onClick,
    viewMode = 'grid',
    showPriority = true,
    showAssignee = false,
    workspaceId,
}) => {
    const deleteTask = useDeletetask();
    const navigate = useNavigate();

    const handleDelete = () => {
        Modal.confirm({
            title: 'Delete task',
            content: 'Are you sure you want to delete this task?',
            okText: 'Delete',
            okButtonProps: { danger: true, loading: deleteTask.isPending },
            cancelText: 'Cancel',
            onOk: () => deleteTask.mutate(task.id),
        });
    };

    const handleEdit = () => {
        const url = workspaceId
            ? `/tasks/${task.id}?workspace=${workspaceId}`
            : `/tasks/${task.id}`;
        navigate(url);
    };

    const dropdownItems = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: handleEdit,
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
            onClick: handleDelete,
        },
    ];

    const renderPriority = () => {
        if (!task.priority) return null;
        const config = PRIORITY_CONFIG[task.priority];
        return (
            <span style={{
                padding: viewMode === 'list' ? '2px 6px' : '2px 8px',
                borderRadius: '4px',
                fontSize: viewMode === 'list' ? '10px' : '11px',
                fontWeight: 600,
                background: config.bg,
                color: config.color,
                flexShrink: 0,
            }}>
                {config.label}
            </span>
        );
    };

    const renderCommentCount = () => {
        const count = task.comments?.length || task.commentCount || 0;
        if (count === 0) return null;
        return (
            <Space size={4} style={{ color: colors.textMuted, fontSize: '11px' }}>
                <MessageOutlined style={{ fontSize: 12 }} />
                <span>{count}</span>
            </Space>
        );
    };

    const renderAssignee = () => {
        if (!showAssignee) return null;
        if (task.assignee) {
            return (
                <Tooltip title={`Assigned to ${task.assignee.username}`}>
                    <Avatar size="small" style={{ background: colors.accent, color: colors.white, flexShrink: 0 }}>
                        {task.assignee.username?.[0]?.toUpperCase()}
                    </Avatar>
                </Tooltip>
            );
        }
        return (
            <span style={{ color: colors.textMuted, fontSize: '0.75rem', flexShrink: 0 }}>Unassigned</span>
        );
    };

    const statusConfig = STATUS_CONFIG[task.status];

    // List View
    if (viewMode === 'list') {
        return (
            <div
                onClick={() => onClick?.(task)}
                className="rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
                <Tag color={statusConfig.color} icon={statusConfig.icon} className="text-xs! shrink-0">
                    {statusConfig.label}
                </Tag>

                {showPriority && renderPriority()}

                <div className="flex-1 min-w-0">
                    <p style={{ color: colors.text, fontWeight: 500 }} className="truncate">{task.title}</p>
                    {task.description && (
                        <p style={{ color: colors.textMuted, fontSize: '0.75rem' }} className="truncate">
                            {task.description}
                        </p>
                    )}
                </div>

                <span style={{ color: colors.textMuted, fontSize: '11px', flexShrink: 0 }}>
                    {formatDistanceToNow(task.createdAt)}
                </span>

                {renderCommentCount()}

                <Tooltip title={task.user?.username}>
                    <Avatar size="small" style={{ background: colors.accent, color: colors.white, flexShrink: 0 }}>
                        {task.user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                </Tooltip>

                {showAssignee && renderAssignee()}

                <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 24,
                                height: 24,
                                borderRadius: 4,
                                cursor: 'pointer',
                                color: colors.textLight,
                            }}
                            className="hover:bg-gray-200"
                        >
                            <EllipsisOutlined style={{ fontSize: 16 }} />
                        </div>
                    </Dropdown>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <Card
            hoverable
            onClick={() => onClick?.(task)}
            style={{
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                height: '100%',
            }}
            styles={{ body: { padding: 16, display: 'flex', flexDirection: 'column', height: '100%' } }}
        >
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <Tag color={statusConfig.color} icon={statusConfig.icon}>
                        {statusConfig.label}
                    </Tag>
                    {showPriority && renderPriority()}
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 24,
                                height: 24,
                                borderRadius: 4,
                                cursor: 'pointer',
                                color: colors.textLight,
                            }}
                            className="hover:bg-gray-200"
                        >
                            <EllipsisOutlined style={{ fontSize: 16 }} />
                        </div>
                    </Dropdown>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{ color: colors.text, fontWeight: 600, marginBottom: 4 }}>
                    {task.title}
                </h4>
                {task.description && (
                    <p style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
                        {task.description}
                    </p>
                )}
            </div>

            <div
                className="flex items-center justify-between mt-4 pt-3"
                style={{ borderTop: `1px solid ${colors.border}` }}
            >
                <Space size={12}>
                    <Tooltip title={task.user?.username}>
                        <Avatar size="small" style={{ background: colors.accent, color: colors.white }}>
                            {task.user?.username?.[0]?.toUpperCase()}
                        </Avatar>
                    </Tooltip>
                    <span style={{ color: colors.textMuted, fontSize: '11px' }}>
                        {formatDistanceToNow(task.createdAt)}
                    </span>
                    {renderCommentCount()}
                </Space>

                {showAssignee && (
                    <Space size={8}>
                        {renderAssignee()}
                    </Space>
                )}
            </div>
        </Card>
    );
};

export default TaskCard;
