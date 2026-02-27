import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Avatar, Tooltip } from 'antd';
import { MessageOutlined, UserOutlined, HolderOutlined } from '@ant-design/icons';
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

const KanbanCard: React.FC<KanbanCardProps> = ({
    task,
    isDragging = false,
    dragHandleProps
}) => {
    const navigate = useNavigate();

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

    return (
        <Card
            hoverable
            className={`animate-fade-in ${isDragging ? 'dragging' : ''}`}
            onClick={() => navigate(`/tasks/${task.id}`)}
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

                    <div
                        {...dragHandleProps}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-black/5 rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <HolderOutlined style={{ color: '#9ca3af', fontSize: 14 }} />
                    </div>
                </div>

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

                {task.description && (
                    <Text
                        type="secondary"
                        style={{
                            display: 'block',
                            fontSize: '0.8rem',
                            lineHeight: 1.4,
                            color: '#525252',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {task.description}
                    </Text>
                )}

                <div
                    className="flex items-center justify-between pt-2"
                    style={{
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        marginTop: 2,
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
