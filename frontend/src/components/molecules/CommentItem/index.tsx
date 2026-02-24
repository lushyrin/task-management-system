import { useState } from 'react';
import { Avatar, Button, Dropdown, Input, Space, Typography } from 'antd';
import { UserOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CommentItemProps } from './CommentItem.types';
import { formatDistanceToNow } from '@/utils/helpers';

const { Text } = Typography;
const { TextArea } = Input;

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onEdit,
    onDelete,
    isOwner = false,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const handleSave = () => {
        if (editContent.trim() && editContent !== comment.content) {
            onEdit?.({ ...comment, content: editContent.trim() });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditContent(comment.content);
        setIsEditing(false);
    };

    const dropdownItems = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: () => setIsEditing(true),
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
            onClick: () => onDelete?.(comment.id),
        },
    ];

    return (
        <div
            className="animate-fade-in"
            style={{ display: 'flex', gap: '12px', padding: '10px 0', width: '100%' }}
        >
            <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{ background: '#facc15', color: '#713f12', fontWeight: 600, flexShrink: 0 }}
            >
                {comment.user?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <div style={{ flex: 1, minWidth: 0 }}>
                <Space size={8} style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: '0.8rem', color: '#171717' }}>
                        {comment.user?.username || 'Unknown'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                        {formatDistanceToNow(comment.createdAt)}
                        {comment.updatedAt !== comment.createdAt && ' (edited)'}
                    </Text>
                </Space>

                {isEditing ? (
                    <div style={{ width: '100%' }}>
                        <TextArea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            autoSize={{ minRows: 2, maxRows: 8 }}
                            autoFocus
                            style={{ width: '100%', marginBottom: 8 }}
                        />
                        <Space size={6}>
                            <Button type="primary" size="small" onClick={handleSave}>
                                Save
                            </Button>
                            <Button size="small" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Space>
                    </div>
                ) : (
                    <Text style={{ fontSize: '0.875rem', color: '#404040', display: 'block', wordBreak: 'break-word' }}>
                        {comment.content}
                    </Text>
                )}
            </div>

            {isOwner && !isEditing && (
                <Dropdown
                    menu={{ items: dropdownItems }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        size="small"
                        icon={<EllipsisOutlined style={{ fontSize: 18 }} />}
                        style={{ color: '#a3a3a3', flexShrink: 0 }}
                    />
                </Dropdown>
            )}
        </div>
    );
};

export default CommentItem;