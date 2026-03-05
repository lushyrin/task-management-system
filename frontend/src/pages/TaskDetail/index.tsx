import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Alert, Button, Divider, Spin, Typography, Space, Tag, Avatar, Tooltip, Input, Select, Modal } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EditOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { CommentList } from '@/components/organisms';
import { useGetTaskById, useDeletetask } from '@/hooks/useTasks';
import { useGetWorkspaceTask, useWorkspace } from '@/hooks/useWorkspace';
import { useGetCommentsByTaskId, useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/useComments';
import { taskService } from '@/services/task.service';
import { workspaceService } from '@/services/workspace.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from '@/utils/helpers';
import { STATUS_CONFIG } from '@/utils/uiConfig';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const workspaceId = searchParams.get('workspace');
    const isWorkspace = !!workspaceId;

    // ONE colors object - accent changes based on workspace or personal
    const colors = {
        text: '#171717',
        textMuted: '#737373',
        textLight: '#a3a3a3',
        textSecondary: '#525252',
        border: '#e5e5e5',
        bg: '#fafafa',
        bgHover: '#f5f5f5',
        white: '#ffffff',
        accent: isWorkspace ? '#eab308' : '#3b82f6',
        accentLight: isWorkspace ? '#fef9c3' : '#dbeafe',
    };

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editAssigneeId, setEditAssigneeId] = useState<string | null>(null);
    const titleInputRef = useRef<any>(null);

    const {
        data: personalTask,
        isLoading: personalLoading,
        isError: personalError
    } = useGetTaskById(workspaceId ? '' : id!);

    const {
        data: workspaceTask,
        isLoading: workspaceLoading,
        isError: workspaceError
    } = useGetWorkspaceTask(workspaceId || '', workspaceId ? id! : '');

    const { data: workspace } = useWorkspace(workspaceId || '');
    const deleteTask = useDeletetask();

    const task = workspaceId ? workspaceTask : personalTask;

    const hasChanges = task && (
        editTitle !== task.title ||
        editDescription !== (task.description || '') ||
        (isWorkspace && editAssigneeId !== (task.assigneeId || null))
    );
    const canSave = editTitle.trim() !== '' && hasChanges;
    const isLoading = workspaceId ? workspaceLoading : personalLoading;
    const isError = workspaceId ? workspaceError : personalError;

    const { data: comments, isLoading: commentsLoading } = useGetCommentsByTaskId(id!);
    const createComment = useCreateComment();
    const updateComment = useUpdateComment();
    const deleteComment = useDeleteComment();

    useEffect(() => {
        if (task) {
            setEditTitle(task.title);
            setEditDescription(task.description || '');
            setEditAssigneeId(task.assigneeId || null);
        }
    }, [task]);

    useEffect(() => {
        if (isEditing && titleInputRef.current) {
            setTimeout(() => titleInputRef.current?.focus(), 100);
        }
    }, [isEditing]);

    const updatePersonalTask = useMutation({
        mutationFn: (data: { title: string; description: string }) =>
            taskService.update(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsEditing(false);
        },
        onError: (error: Error) => {
            alert(error.message || 'Failed to update task');
        },
    });

    const updateWorkspaceTask = useMutation({
        mutationFn: (data: { title: string; description: string; assigneeId?: string | null }) =>
            workspaceService.updateTask(workspaceId!, id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'tasks'] });
            queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'tasks', id] });
            setIsEditing(false);
        },
        onError: (error: Error) => {
            alert(error.message || 'Failed to update task');
        },
    });

    const handleSave = () => {
        if (!editTitle.trim()) return;

        if (isWorkspace) {
            updateWorkspaceTask.mutate({
                title: editTitle.trim(),
                description: editDescription.trim(),
                assigneeId: editAssigneeId,
            });
        } else {
            updatePersonalTask.mutate({
                title: editTitle.trim(),
                description: editDescription.trim(),
            });
        }
    };

    const handleCancel = () => {
        if (task) {
            setEditTitle(task.title);
            setEditDescription(task.description || '');
            setEditAssigneeId(task.assigneeId || null);
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Delete Task',
            content: 'Are you sure you want to delete this task? This action cannot be undone.',
            okText: 'Delete',
            okButtonProps: { danger: true },
            cancelText: 'Cancel',
            onOk: () => {
                if (isWorkspace) {
                    workspaceService.deleteTask(workspaceId!, id!).then(() => {
                        navigate(`/workspace/${workspaceId}`);
                    });
                } else {
                    deleteTask.mutate(id!, {
                        onSuccess: () => navigate('/tasks')
                    });
                }
            },
        });
    };

    const handleCreateComment = (content: string) => createComment.mutate({ taskId: id!, content });
    const handleUpdateComment = (commentId: string, content: string) => updateComment.mutate({ id: commentId, data: { content } });
    const handleDeleteComment = (commentId: string) => deleteComment.mutate({ id: commentId, taskId: id! });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full py-40">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !task) {
        return (
            <div className="p-6">
                <Alert
                    type="error"
                    showIcon
                    message="Task not found"
                    description="This task may have been deleted or you don't have access to it."
                    action={
                        <Button onClick={() => navigate(workspaceId ? `/workspace/${workspaceId}` : '/tasks')}>
                            Back
                        </Button>
                    }
                />
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[task.status];
    const memberOptions = workspace?.members?.map((m: any) => ({
        label: m.user.username,
        value: m.userId,
    })) || [];

    return (
        <div className="task-detail-page">
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: '16px', color: colors.textMuted, paddingLeft: 0 }}
            >
                Back
            </Button>

            <div className="task-detail-content">
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                        <Space size="small">
                            <Tag color={statusConfig.color} icon={statusConfig.icon} style={{ fontWeight: 500 }}>
                                {statusConfig.label}
                            </Tag>
                        </Space>

                        <Space>
                            {isEditing ? (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        onClick={handleSave}
                                        loading={updatePersonalTask.isPending || updateWorkspaceTask.isPending}
                                        disabled={!canSave}
                                        style={{
                                            background: canSave ? colors.accent : colors.textLight,
                                            borderColor: canSave ? colors.accent : colors.textLight,
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button icon={<CloseOutlined />} onClick={handleCancel}>Cancel</Button>
                                </>
                            ) : (
                                <>
                                    <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Edit</Button>
                                    <Button danger icon={<DeleteOutlined />} onClick={handleDelete} loading={deleteTask.isPending}>Delete</Button>
                                </>
                            )}
                        </Space>
                    </div>

                    {isEditing ? (
                        <Input
                            ref={titleInputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onPressEnter={handleSave}
                            size="large"
                            style={{ marginBottom: '12px', fontSize: '1.5rem', fontWeight: 700 }}
                            placeholder="Task title"
                        />
                    ) : (
                        <Title level={2} style={{ margin: '0 0 12px 0', fontSize: '1.5rem', fontWeight: 700, color: colors.text }}>
                            {task.title}
                        </Title>
                    )}

                    <div className="task-meta" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <Tooltip title={task.user?.username ?? 'Unknown'}>
                            <Avatar size="small" style={{ background: colors.accent, color: colors.white }}>
                                {task.user?.username?.[0]?.toUpperCase()}
                            </Avatar>
                        </Tooltip>

                        <Text type="secondary" style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
                            {task.user?.username ?? 'Unknown'}
                        </Text>

                        <Divider style={{ margin: 0, height: 20, borderColor: colors.border }} />

                        <Space size="small" style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
                            <CalendarOutlined />
                            <Text type="secondary">Created {formatDistanceToNow(task.createdAt)}</Text>
                        </Space>

                        {task.updatedAt !== task.createdAt && (
                            <>
                                <Divider style={{ margin: 0, height: 20, borderColor: colors.border }} />
                                <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                                    Updated {formatDistanceToNow(task.updatedAt)}
                                </Text>
                            </>
                        )}
                    </div>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ marginBottom: '20px' }}>
                    <Text strong style={{ fontSize: '0.875rem', color: colors.textSecondary, display: 'block', marginBottom: '8px' }}>
                        Description
                    </Text>
                    {isEditing ? (
                        <TextArea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={4}
                            placeholder="Add a description..."
                            style={{ fontSize: '0.875rem' }}
                        />
                    ) : task.description ? (
                        <Paragraph className="task-description" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            {task.description}
                        </Paragraph>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
                            No description provided.
                        </Text>
                    )}
                </div>

                {isWorkspace && (
                    <div style={{ marginBottom: '20px' }}>
                        <Text strong style={{ fontSize: '0.875rem', color: colors.textSecondary, display: 'block', marginBottom: '8px' }}>
                            Assignee
                        </Text>
                        {isEditing ? (
                            <Select
                                value={editAssigneeId}
                                onChange={(val) => setEditAssigneeId(val)}
                                options={memberOptions}
                                placeholder="Unassigned"
                                allowClear
                                style={{ width: 200 }}
                                prefix={<UserOutlined />}
                            />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {task.assignee ? (
                                    <>
                                        <Avatar size="small" style={{ background: colors.accent, color: colors.white }}>
                                            {task.assignee.username?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <Text>{task.assignee.username}</Text>
                                    </>
                                ) : (
                                    <Text type="secondary" style={{ fontStyle: 'italic' }}>Unassigned</Text>
                                )}
                            </div>
                        )}
                    </div>
                )}
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
};

export default TaskDetail;
