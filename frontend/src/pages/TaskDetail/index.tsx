import { useParams, useNavigate } from 'react-router-dom';
import { CommentList } from '@/components/organisms';
import { Button, Spinner, Typography } from '@/components/atoms';
import { useGetTaskById } from '@/hooks/useTasks';
import {
    useGetCommentsByTaskId,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
} from '@/hooks/useComments';
import { formatDate } from '@/utils/helpers';
import type { TaskStatus } from '@/types';

const statusLabels: Record<TaskStatus, string> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    done: 'Done',
};

const statusColors: Record<TaskStatus, string> = {
    not_started: 'status-not-started',
    in_progress: 'status-in-progress',
    done: 'status-done',
};

const TaskDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: task, isLoading: isLoadingTask } = useGetTaskById(id || '');
    const { data: comments, isLoading: isLoadingComments } = useGetCommentsByTaskId(id || '');

    const createComment = useCreateComment();
    const updateComment = useUpdateComment();
    const deleteComment = useDeleteComment();

    const handleCreateComment = (content: string) => {
        if (id) {
            createComment.mutate({ content, taskId: id });
        }
    };

    const handleUpdateComment = (commentId: string, content: string) => {
        updateComment.mutate({ id: commentId, data: { content } });
    };

    const handleDeleteComment = (commentId: string) => {
        if (id) {
            deleteComment.mutate({ id: commentId, taskId: id });
        }
    };

    if (isLoadingTask) {
        return (
            <div className="task-detail-loading">
                <Spinner />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="task-detail-not-found">
                <Typography.Title level={2}>Task Not Found</Typography.Title>
                <Button onClick={() => navigate('/tasks')}>Back to Tasks</Button>
            </div>
        );
    }

    return (
        <div className="task-detail-page">
            {/* Header */}
            <div className="task-detail-header">
                <Button onClick={() => navigate(-1)}>← Back</Button>
                <div className={`task-status ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                </div>
            </div>

            {/* Task Info */}
            <div className="task-detail-content">
                <Typography.Title level={1}>{task.title}</Typography.Title>
                
                <div className="task-meta">
                    <span>Created by: {task.user?.username || 'Unknown'}</span>
                    <span>Created: {formatDate(task.createdAt)}</span>
                    {task.updatedAt !== task.createdAt && (
                        <span>Updated: {formatDate(task.updatedAt)}</span>
                    )}
                </div>

                <div className="task-description">
                    <Typography.Title level={3}>Description</Typography.Title>
                    <p>{task.description || 'No description provided.'}</p>
                </div>
            </div>

            {/* Comments Section */}
            <div className="task-comments-section">
                <CommentList
                    comments={comments}
                    isLoading={isLoadingComments}
                    taskId={task.id}
                    onCreate={handleCreateComment}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                    isCreating={createComment.isPending}
                    isUpdating={updateComment.isPending}
                    isDeleting={deleteComment.isPending}
                />
            </div>
        </div>
    );
};

export default TaskDetailPage;
