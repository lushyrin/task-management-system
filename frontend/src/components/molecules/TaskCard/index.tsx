import { Card, Space, Avatar, Tooltip, Dropdown, Modal, Tag } from 'antd';
import { MessageOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Task } from '@/types';
import { formatDistanceToNow } from '@/utils/helpers';
import { STATUS_CONFIG } from '@/utils/uiConfig';
import { useDeletetask } from '@/hooks/useTasks';
import { useNavigate } from 'react-router-dom';

const colors = {
    text: '#171717',
    textMuted: '#737373',
    textLight: '#a3a3a3',
    accent: '#eab308',
    border: '#e5e5e5',
    bg: '#fafafa',
    white: '#ffffff',
};

const DESCRIPTION_MIN_HEIGHT = '2.625rem';

interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
    viewMode?: 'grid' | 'list';
    showAssignee?: boolean;
    workspaceId?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onClick,
    viewMode = 'grid',
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
        { key: 'edit', icon: <EditOutlined />, label: 'Edit', onClick: handleEdit },
        { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true, onClick: handleDelete },
    ];

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
        return <span style={{ color: colors.textMuted, fontSize: '0.75rem', flexShrink: 0 }}>Unassigned</span>;
    };

    const statusConfig = STATUS_CONFIG[task.status];

    const actionsDropdown = (
        <div onClick={(e) => e.stopPropagation()}>
            <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight">
                <div
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 24, height: 24, borderRadius: 4, cursor: 'pointer', color: colors.textLight,
                    }}
                    className="hover:bg-gray-200"
                >
                    <EllipsisOutlined style={{ fontSize: 16 }} />
                </div>
            </Dropdown>
        </div>
    );

    if (viewMode === 'list') {
        return (
            <div
                onClick={() => onClick?.(task)}
                className="rounded-xl px-4 hover:shadow-md transition-shadow cursor-pointer"
                style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}
            >
                <Tag
                    color={statusConfig.color}
                    icon={statusConfig.icon}
                    className="shrink-0"
                    style={{ fontSize: '11px', margin: 0 }}
                >
                    {statusConfig.label}
                </Tag>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        color: colors.text,
                        fontWeight: 500,
                        margin: 0,
                        lineHeight: 1.4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {task.title}
                    </p>
                    <p style={{
                        color: colors.textMuted,
                        fontSize: '0.75rem',
                        margin: 0,
                        lineHeight: 1.4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        visibility: task.description ? 'visible' : 'hidden',
                    }}>
                        {task.description || '\u00A0'}
                    </p>
                </div>

                <span style={{ color: colors.textMuted, fontSize: '11px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {formatDistanceToNow(task.createdAt)}
                </span>

                {renderCommentCount()}

                <Tooltip title={task.user?.username}>
                    <Avatar size="small" style={{ background: colors.accent, color: colors.white, flexShrink: 0 }}>
                        {task.user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                </Tooltip>

                {showAssignee && renderAssignee()}
                {actionsDropdown}
            </div>
        );
    }

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
            styles={{
                body: { padding: 16, display: 'flex', flexDirection: 'column', height: '100%' }
            }}
        >
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <Tag color={statusConfig.color} icon={statusConfig.icon}>{statusConfig.label}</Tag>
                </div>
                {actionsDropdown}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                    color: colors.text,
                    fontWeight: 600,
                    marginBottom: 6,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {task.title}
                </h4>

                <p style={{
                    color: colors.textMuted,
                    fontSize: '0.875rem',
                    margin: 0,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: DESCRIPTION_MIN_HEIGHT,
                    visibility: task.description ? 'visible' : 'hidden',
                }}>
                    {task.description || '\u00A0'}
                </p>
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
                {showAssignee && <Space size={8}>{renderAssignee()}</Space>}
            </div>
        </Card>
    );
};

export default TaskCard;