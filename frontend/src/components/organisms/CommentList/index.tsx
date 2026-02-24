import { useState } from 'react';
import { List, Input, Button, Typography, Empty } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { CommentItem } from '@/components/molecules';
import { Spinner } from '@/components/atoms';
import { useAuth } from '@/hooks/useAuth';
import type { Comment } from '@/types';

const { Title } = Typography;
const { TextArea } = Input;

interface CommentListProps {
    comments: Comment[] | undefined;
    isLoading: boolean;
    onCreate: (content: string) => void;
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    isCreating?: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({
    comments,
    isLoading,
    onCreate,
    onUpdate,
    onDelete,
    isCreating = false,
}) => {
    const { user } = useAuth();
    const [newComment, setNewComment] = useState('');

    const handleSubmit = () => {
        if (newComment.trim()) {
            onCreate(newComment.trim());
            setNewComment('');
        }
    };

    const handleEdit = (comment: Comment) => {
        onUpdate(comment.id, comment.content);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="comment-list">
            <Title level={4} className="comment-list-title">
                Comments ({comments?.length || 0})
            </Title>

            <div className="comment-form">
                <TextArea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    disabled={isCreating}
                    rows={3}
                    className="flex-1"
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || isCreating}
                    loading={isCreating}
                >
                    Post
                </Button>
            </div>

            {comments && comments.length > 0 ? (
                <List
                    dataSource={comments}
                    renderItem={(comment) => (
                        <List.Item className="!border-0 !p-0">
                            <CommentItem
                                comment={comment}
                                onEdit={handleEdit}
                                onDelete={onDelete}
                                isOwner={user?.id === comment.userId}
                            />
                        </List.Item>
                    )}
                    split={false}
                    className="space-y-3"
                />
            ) : (
                <Empty
                    description="No comments yet. Be the first to comment!"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="py-8"
                />
            )}
        </div>
    );
};

export default CommentList;
