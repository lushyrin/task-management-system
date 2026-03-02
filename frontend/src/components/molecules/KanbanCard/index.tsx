import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Avatar, Tooltip, Input, Dropdown } from 'antd';
import { MessageOutlined, UserOutlined, HolderOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, EllipsisOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from '@/utils/helpers';
import type { KanbanCardProps } from './KanbanCard.types.ts';

const { Text } = Typography;

const cardColors = [
    { bg: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)', label: 'yellow' },
    { bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', label: 'pink' },
    { bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', label: 'orange' },
    { bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', label: 'green' },
    { bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', label: 'orange' },
    { bg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', label: 'purple' },
    { bg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', label: 'teal' },
    { bg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', label: 'coral' },
];

interface KanbanCardExtendedProps extends KanbanCardProps {
    onUpdate?: (taskId: string, data: { title?: string; description?: string }) => void;
    onDelete?: (taskId: string) => void;
    workspaceId?: string;
}

const KanbanCard: React.FC<KanbanCardExtendedProps> = ({
    task,
    isDragging = false,
    dragHandleProps,
    onUpdate,
    onDelete,
    workspaceId,
}) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || '');
    const titleInputRef = useRef<any>(null);

    const colorIndex = parseInt(task.id.slice(-1), 16) % cardColors.length;
    const color = cardColors[colorIndex];

    const statusLabel = {
        not_started: 'Not Started',
        in_progress: 'In Progress',
        done: 'Done',
    };

    const priorityConfig = {
        high: { bg: '#fee2e2', color: '#dc2626', label: 'High' },
        medium: { bg: '#fef3c7', color: '#d97706', label: 'Medium' },
        low: { bg: '#ecfdf5', color: '#059669', label: 'Low' },
    };

    const priority = task.priority ? priorityConfig[task.priority] : null;

    const handleSave = () => {
        if (editTitle.trim() && onUpdate) {
            onUpdate(task.id, {
                title: editTitle.trim(),
                description: editDescription.trim(),
            });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setEditDescription(task.description || '');
        setIsEditing(false);
    };

    const handleCardClick = () => {
        if (!isEditing) {
            const url = workspaceId
                ? `/tasks/${task.id}?workspace=${workspaceId}`
                : `/tasks/${task.id}`;
            navigate(url);
        }
    };

    const dropdownItems = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: (e: any) => {
                e.domEvent.stopPropagation();
                setIsEditing(true);
                setTimeout(() => titleInputRef.current?.focus(), 0);
            },
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
            onClick: (e: any) => {
                e.domEvent.stopPropagation();
                onDelete?.(task.id);
            },
        },
    ];

    // Consistent card height calculation
    const descriptionHeight = '2.4rem'; // Height for 2 lines of text

    return (
        <Card
            hoverable={!isEditing}
            className={`animate-fade-in ${isDragging ? 'dragging' : ''}`}
            onClick={handleCardClick}
            bodyStyle={{
                padding: 14,
                background: 'transparent',
            }}
            style={{
                background: color.bg,
                borderRadius: '8px',
                border: 'none',
                boxShadow: isDragging
                    ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                    : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease',
                minHeight: '140px', // Minimum consistent height
            }}
        >
            <Space direction="vertical" className="w-full" size={10}>

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <Tooltip title={statusLabel[task.status]}>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: task.status === 'done' ? '#22c55e' :
                                        task.status === 'in_progress' ? '#eab308' : '#9ca3af',
                                }}
                            />
                        </Tooltip>

                        {priority && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: priority.bg,
                                    color: priority.color,
                                }}
                            >
                                {priority.label}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {isEditing ? (
                            <Space size={4}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleSave(); }}
                                    className="p-1 rounded hover:bg-black/10 transition-colors"
                                    style={{ color: '#22c55e' }}
                                >
                                    <CheckOutlined style={{ fontSize: 14 }} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                                    className="p-1 rounded hover:bg-black/10 transition-colors"
                                    style={{ color: '#ef4444' }}
                                >
                                    <CloseOutlined style={{ fontSize: 14 }} />
                                </button>
                            </Space>
                        ) : (
                            <>
                                <div
                                    {...dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-black/5 rounded transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <HolderOutlined style={{ color: '#9ca3af', fontSize: 14 }} />
                                </div>
                                <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight">
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1 hover:bg-black/5 rounded transition-colors cursor-pointer"
                                    >
                                        <EllipsisOutlined style={{ color: '#9ca3af', fontSize: 14 }} />
                                    </div>
                                </Dropdown>
                            </>
                        )}
                    </div>
                </div>


                {isEditing ? (
                    <Input
                        ref={titleInputRef}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onPressEnter={handleSave}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                        style={{ fontWeight: 600, fontSize: '0.9rem' }}
                    />
                ) : (
                    <Text
                        strong
                        style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            lineHeight: 1.4,
                            fontWeight: 600,
                            color: '#171717',
                        }}
                    >
                        {task.title}
                    </Text>
                )}


                <div style={{ minHeight: descriptionHeight }}>
                    {isEditing ? (
                        <Input.TextArea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            onPressEnter={(e) => { e.preventDefault(); handleSave(); }}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                            rows={2}
                            placeholder="Add description..."
                            style={{ fontSize: '0.8rem', resize: 'none' }}
                        />
                    ) : (
                        <Text
                            type="secondary"
                            style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                lineHeight: 1.4,
                                color: task.description ? '#525252' : '#a3a3a3',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: descriptionHeight,
                            }}
                        >
                            {task.description || 'No description'}
                        </Text>
                    )}
                </div>


                <div
                    className="flex items-center justify-between pt-2"
                    style={{
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        marginTop: 'auto',
                    }}
                >
                    <Space size={8}>
                        <Tooltip title={task.user?.username || 'Unknown'}>
                            <Avatar
                                size="small"
                                style={{
                                    background: '#facc15',
                                    color: '#713f12',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    width: 24,
                                    height: 24,
                                }}
                            >
                                {task.user?.username?.charAt(0).toUpperCase() || <UserOutlined />}
                            </Avatar>
                        </Tooltip>

                        {task.comments && task.comments.length > 0 && (
                            <Space size={2} style={{ color: '#737373' }}>
                                <MessageOutlined style={{ fontSize: 12 }} />
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 500,
                                    }}
                                >
                                    {task.comments.length}
                                </Text>
                            </Space>
                        )}
                    </Space>

                    <Text
                        type="secondary"
                        style={{
                            fontSize: '11px',
                            color: '#a3a3a3',
                            fontWeight: 500,
                        }}
                    >
                        {formatDistanceToNow(task.createdAt)}
                    </Text>
                </div>
            </Space>
        </Card>
    );
};

export default KanbanCard;
