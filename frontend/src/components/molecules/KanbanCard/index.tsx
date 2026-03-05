import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Avatar, Tooltip, Dropdown, Popconfirm } from 'antd';
import { MessageOutlined, UserOutlined, HolderOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from '@/utils/helpers';
import type { KanbanCardProps } from './KanbanCard.types.ts';

const { Text } = Typography;

const colors = {
    text: '#171717',
    textMuted: '#737373',
    textLight: '#a3a3a3',
    accent: '#eab308',
    accentDark: '#713f12',
    border: '#e5e5e5',
    bg: '#fafafa',
    white: '#ffffff',
    green: '#22c55e',
    red: '#ef4444',
    gray: '#9ca3af',
};

const cardColors = [
    { bg: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)', label: 'yellow' },
    { bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', label: 'pink' },
    { bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', label: 'orange' },
    { bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', label: 'green' },
    { bg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', label: 'purple' },
    { bg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', label: 'teal' },
    { bg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', label: 'coral' },
];

const STATUS_LABELS = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    done: 'Done',
};

// lineHeight 1.4 × font-size 0.8rem × 2 lines ≈ 36px
const DESCRIPTION_MIN_HEIGHT = '2.24rem';

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

    const colorIndex = parseInt(task.id.slice(-1), 16) % cardColors.length;
    const color = cardColors[colorIndex];

    const handleCardClick = () => {
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
            onClick: (e: any) => {
                e.domEvent.stopPropagation();
                handleCardClick();
            },
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: (
                <Popconfirm
                    title="Delete task"
                    description="Are you sure you want to delete this task?"
                    onConfirm={(e) => { e?.stopPropagation(); onDelete?.(task.id); }}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    cancelText="Cancel"
                >
                    <span onClick={(e) => e.stopPropagation()}>Delete</span>
                </Popconfirm>
            ),
            danger: true,
            onClick: (e: any) => { e.domEvent.stopPropagation(); },
        },
    ];

    return (
        <Card
            hoverable
            className={`animate-fade-in ${isDragging ? 'dragging' : ''}`}
            onClick={handleCardClick}
            styles={{ body: { padding: 14, background: 'transparent' } }}
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

                {/* ── Top row: status dot + priority + controls ── */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <Tooltip title={STATUS_LABELS[task.status]}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 10, height: 10, borderRadius: '50%',
                                background: task.status === 'done' ? colors.green
                                    : task.status === 'in_progress' ? colors.accent
                                        : colors.gray,
                            }} />
                        </Tooltip>

                    </div>

                    <div className="flex items-center gap-1">
                        <div
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-black/5 rounded transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <HolderOutlined style={{ color: colors.gray, fontSize: 14 }} />
                        </div>
                        <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight">
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 hover:bg-black/5 rounded transition-colors cursor-pointer"
                            >
                                <EllipsisOutlined style={{ color: colors.gray, fontSize: 14 }} />
                            </div>
                        </Dropdown>
                    </div>
                </div>

                {/* ── Title ── */}
                <Text strong style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    fontWeight: 600,
                    color: colors.text,
                }}>
                    {task.title}
                </Text>

                {/* ── Description ── */}
                <div style={{
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                    color: colors.textMuted,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: DESCRIPTION_MIN_HEIGHT,
                    visibility: task.description ? 'visible' : 'hidden',
                }}>
                    {task.description || '\u00A0'}
                </div>

                {/* ── Footer ── */}
                <div
                    className="flex items-center justify-between pt-2"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 'auto' }}
                >
                    <Space size={8}>
                        <Tooltip title={task.user?.username || 'Unknown'}>
                            <Avatar
                                size="small"
                                style={{
                                    background: colors.accent, color: colors.accentDark,
                                    fontSize: '11px', fontWeight: 600, width: 24, height: 24,
                                }}
                            >
                                {task.user?.username?.charAt(0).toUpperCase() || <UserOutlined />}
                            </Avatar>
                        </Tooltip>

                        {task.comments && task.comments.length > 0 && (
                            <Space size={2} style={{ color: colors.textMuted }}>
                                <MessageOutlined style={{ fontSize: 12 }} />
                                <Text type="secondary" style={{ fontSize: '11px', fontWeight: 500 }}>
                                    {task.comments.length}
                                </Text>
                            </Space>
                        )}
                    </Space>

                    <Text type="secondary" style={{ fontSize: '11px', color: colors.textLight, fontWeight: 500 }}>
                        {formatDistanceToNow(task.createdAt)}
                    </Text>
                </div>
            </Space>
        </Card>
    );
};

export default KanbanCard;