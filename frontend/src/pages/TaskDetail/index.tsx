import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Divider, Spin, Typography, Space } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { StatusBadge, PriorityBadge } from '@/components/atoms';
import { CommentList } from '@/components/organisms';
import { useGetTaskById } from '@/hooks/useTasks';
import { useGetCommentsByTaskId, useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/useComments';
import { formatDistanceToNow } from '@/utils/helpers';


const { Title, Text, Paragraph } = Typography
const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate();

    const { data: task, isLoading: taskLoading, isError: taskError } = useGetTaskById(id!)
    const { data: comments, isLoading: commentsLoading } = useGetCommentsByTaskId(id!)
    const createComment = useCreateComment()
    const updateComment = useUpdateComment()
    const deleteComment = useDeleteComment()

    const handleCreateComment = (commentContent: string) => {
        createComment.mutate({ taskId: id!, content: commentContent })
    }
    const handleUpdateComment = (commentId: string, commentContent: string) => {
        updateComment.mutate({ id: commentId, data: { content: commentContent } })
    }
    const handleDeleteComment = (commentId: string) => {
        deleteComment.mutate({ id: commentId, taskId: id! })
    }

    if (taskLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Spin size="large" />
            </div>
        );
    }
    if (taskError || !task) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    type="error"
                    showIcon
                    message="Task not found"
                    description="This task may have been deleted or you don't have access to it."
                    action={
                        <Button onClick={() => navigate('/tasks')}>
                            Back to Tasks
                        </Button>
                    }
                />
            </div>
        );
    }
    return (
        <div className="task-detail-page">
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: '16px', color: '#737373', paddingLeft: 0 }}
            >
                Back
            </Button>

            <div className="task-detail-content">
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                        <Space size="small">
                            <StatusBadge status={task.status} />
                            {task.priority && <PriorityBadge priority={task.priority} />}
                        </Space>
                    </div>

                    <Title
                        level={2}
                        style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 700, color: '#171717' }}
                    >
                        {task.title}
                    </Title>

                    <div className="task-meta">
                        <Space size="small" style={{ color: '#737373', fontSize: '0.875rem' }}>
                            <UserOutlined />
                            <Text type="secondary">
                                {task.user?.username ?? 'Unknown'}
                            </Text>
                        </Space>

                        <Space size="small" style={{ color: '#737373', fontSize: '0.875rem' }}>
                            <CalendarOutlined />
                            <Text type="secondary">
                                Created {formatDistanceToNow(task.createdAt)}
                            </Text>
                        </Space>

                        {task.updatedAt !== task.createdAt && (
                            <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                                Updated {formatDistanceToNow(task.updatedAt)}
                            </Text>
                        )}
                    </div>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div>
                    <Text strong
                        style={{ fontSize: '0.875rem', color: '#525252', display: 'block', marginBottom: '8px' }}>
                        Description
                    </Text>
                    {task.description ? (
                        <Paragraph className="task-description" style={{ margin: 0 }}>
                            {task.description}
                        </Paragraph>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                            No description provided.
                        </Text>
                    )}
                </div>
            </div>

            <div className="task-comments-section">
                <CommentList
                    comments={comments}
                    isLoading={commentsLoading}
                    onCreate={handleCreateComment}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                    isCreating={createComment.isPending}
                />
            </div>
        </div>
    );
}

export default TaskDetail;