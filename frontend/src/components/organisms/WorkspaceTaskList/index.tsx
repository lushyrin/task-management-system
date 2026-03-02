import { useState } from "react";
import { Button, Form, Input, Modal, Select, Empty, Tag, Avatar, Tooltip, List, Card, Space, Dropdown, Table } from "antd";
import { PlusOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined, MinusCircleOutlined, MessageOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useWorkspaceTasks, useCreateWorkspaceTask, useAssignTask } from "../../../hooks/useWorkspace";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "@/utils/helpers";
import type { Task, Workspace, WorkspaceMember, TaskStatus, TaskPriority } from "../../../types";

const colors = {
    text: '#171717',
    textMuted: '#737373',
    accent: '#eab308',      // Yellow - workspace brand color
    accentLight: '#fef9c3', // Light yellow
    border: '#e5e5e5',
    bg: '#fafafa',
    bgHover: '#f5f5f5',
};

const STATUS_CONFIG: Record<TaskStatus, { color: string; icon: React.ReactNode; label: string }> = {
    not_started: { color: "default", icon: <MinusCircleOutlined />, label: "Not Started" },
    in_progress: { color: "processing", icon: <ClockCircleOutlined />, label: "In Progress" },
    done: { color: "success", icon: <CheckCircleOutlined />, label: "Done" },
};

const PRIORITY_CONFIG: Record<TaskPriority, { bg: string; color: string; label: string }> = {
    high: { bg: '#fee2e2', color: '#dc2626', label: 'High' },
    medium: { bg: '#fef3c7', color: '#d97706', label: 'Medium' },
    low: { bg: '#ecfdf5', color: '#059669', label: 'Low' },
};

interface WorkspaceTaskListProps {
    workspace: Workspace;
    currentUserId: string;
    viewMode?: 'list' | 'grid';
}

const WorkspaceTaskList = ({ workspace, currentUserId, viewMode = 'grid' }: WorkspaceTaskListProps) => {
    const navigate = useNavigate();
    const isOwner = workspace.ownerId === currentUserId;
    const { data: tasks, isLoading } = useWorkspaceTasks(workspace.id);
    const createTask = useCreateWorkspaceTask(workspace.id);
    const assignTask = useAssignTask(workspace.id);
    const [createOpen, setCreateOpen] = useState(false);
    const [form] = Form.useForm();

    const memberOptions = workspace.members?.map((m: WorkspaceMember) => ({
        label: m.user.username,
        value: m.userId,
    }));

    const handleCreate = async (values: { title: string; description?: string; assigneeId?: string }) => {
        await createTask.mutateAsync({
            title: values.title,
            description: values.description,
            assigneeId: values.assigneeId || null,
        });
        setCreateOpen(false);
        form.resetFields();
    };

    const handleAssign = (taskId: string, assigneeId: string | null) => {
        assignTask.mutate({ taskId, payload: { assigneeId } });
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <span style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
                    {tasks?.length ?? 0} tasks
                </span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateOpen(true)}
                    style={{ background: colors.accent, borderColor: colors.accent }}
                >
                    Add Task
                </Button>
            </div>

            {viewMode === 'grid' && (
                <>
                    {!tasks || tasks.length === 0 ? (
                        <Empty
                            description={<span style={{ color: colors.textMuted }}>No tasks yet. Create the first one!</span>}
                            className="py-10"
                        />
                    ) : (
                        <List
                            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
                            dataSource={tasks}
                            renderItem={(task: Task) => {
                                const statusConfig = STATUS_CONFIG[task.status];
                                const commentCount = task.comments?.length || task.commentCount || 0;
                                
                                const dropdownItems = [
                                    {
                                        key: 'edit',
                                        icon: <EditOutlined />,
                                        label: 'Edit',
                                        onClick: () => navigate(`/tasks/${task.id}?workspace=${workspace.id}`),
                                    },
                                    {
                                        key: 'delete',
                                        icon: <DeleteOutlined />,
                                        label: 'Delete',
                                        danger: true,
                                        onClick: () => {
                                            // Handle delete - you may want to add a mutation for this
                                            Modal.confirm({
                                                title: 'Delete task',
                                                content: 'Are you sure you want to delete this task?',
                                                okText: 'Delete',
                                                okButtonProps: { danger: true },
                                                cancelText: 'Cancel',
                                                onOk: () => console.log('Delete task', task.id),
                                            });
                                        },
                                    },
                                ];
                                
                                return (
                                    <List.Item style={{ height: '100%' }}>
                                        <Card
                                            hoverable
                                            onClick={() => navigate(`/tasks/${task.id}?workspace=${workspace.id}`)}
                                            style={{
                                                borderRadius: 12,
                                                border: `1px solid ${colors.border}`,
                                                background: colors.bg,
                                                cursor: 'pointer',
                                                height: '100%',
                                            }}
                                            styles={{ body: { padding: 16, display: 'flex', flexDirection: 'column', height: '100%' } }}
                                        >

                                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Tag color={statusConfig.color} icon={statusConfig.icon}>
                                                        {statusConfig.label}
                                                    </Tag>
                                                    {task.priority && (
                                                        <span style={{
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            background: PRIORITY_CONFIG[task.priority].bg,
                                                            color: PRIORITY_CONFIG[task.priority].color,
                                                        }}>
                                                            {PRIORITY_CONFIG[task.priority].label}
                                                        </span>
                                                    )}
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
                                                                color: '#a3a3a3',
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
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Space size={12}>
                                                    <Tooltip title={`Created by ${task.user?.username}`}>
                                                        <Avatar size="small" style={{ background: colors.accent, color: '#fff' }}>
                                                            {task.user?.username?.[0]?.toUpperCase()}
                                                        </Avatar>
                                                    </Tooltip>
                                                    <span style={{ color: colors.textMuted, fontSize: '11px' }}>
                                                        {formatDistanceToNow(task.createdAt)}
                                                    </span>
                                                    {commentCount > 0 && (
                                                        <Space size={4} style={{ color: colors.textMuted, fontSize: '11px' }}>
                                                            <MessageOutlined style={{ fontSize: 12 }} />
                                                            <span>{commentCount}</span>
                                                        </Space>
                                                    )}
                                                </Space>

                                                {isOwner ? (
                                                    <Select
                                                        size="small"
                                                        placeholder="Assign"
                                                        value={task.assigneeId ?? undefined}
                                                        onChange={(val) => handleAssign(task.id, val ?? null)}
                                                        options={memberOptions}
                                                        allowClear
                                                        style={{ width: 110 }}
                                                        popupMatchSelectWidth={false}
                                                    />
                                                ) : task.assignee ? (
                                                    <Tooltip title={`Assigned to ${task.assignee.username}`}>
                                                        <Avatar size="small" style={{ background: colors.accent, color: '#fff' }}>
                                                            {task.assignee.username?.[0]?.toUpperCase()}
                                                        </Avatar>
                                                    </Tooltip>
                                                ) : (
                                                    <span style={{ color: colors.textMuted, fontSize: '0.75rem' }}>Unassigned</span>
                                                )}
                                            </div>
                                        </Card>
                                    </List.Item>
                                );
                            }}
                        />
                    )}
                </>
            )}

            {viewMode === 'list' && (
                <>
                    {!tasks || tasks.length === 0 ? (
                        <Empty
                            description={<span style={{ color: colors.textMuted }}>No tasks yet. Create the first one!</span>}
                            className="py-10"
                        />
                    ) : (
                        <Table
                            dataSource={tasks}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                            onRow={(task) => ({
                                onClick: () => navigate(`/tasks/${task.id}?workspace=${workspace.id}`),
                                style: { cursor: 'pointer' }
                            })}
                            rowClassName="hover:bg-gray-50"
                            columns={[
                                {
                                    title: 'Status',
                                    dataIndex: 'status',
                                    width: 130,
                                    render: (status: TaskStatus) => {
                                        const config = STATUS_CONFIG[status];
                                        return (
                                            <Tag color={config.color} icon={config.icon}>
                                                {config.label}
                                            </Tag>
                                        );
                                    }
                                },
                                {
                                    title: 'Priority',
                                    dataIndex: 'priority',
                                    width: 80,
                                    render: (priority: TaskPriority | undefined) => {
                                        if (!priority) return '—';
                                        const config = PRIORITY_CONFIG[priority];
                                        return (
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                background: config.bg,
                                                color: config.color,
                                            }}>
                                                {config.label}
                                            </span>
                                        );
                                    }
                                },
                                {
                                    title: 'Title',
                                    dataIndex: 'title',
                                    render: (text: string, task: Task) => (
                                        <div style={{ minWidth: 200 }}>
                                            <div style={{ fontWeight: 500, marginBottom: task.description ? 4 : 0, color: colors.text }}>
                                                {text}
                                            </div>
                                            {task.description && (
                                                <div style={{ 
                                                    color: colors.textMuted, 
                                                    fontSize: '0.75rem',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {task.description}
                                                </div>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    title: 'Comments',
                                    dataIndex: 'comments',
                                    width: 90,
                                    align: 'center' as const,
                                    render: (_: any, task: Task) => {
                                        const count = task.comments?.length || task.commentCount || 0;
                                        return count > 0 ? (
                                            <Space size={4} style={{ color: colors.textMuted }}>
                                                <MessageOutlined />
                                                <span>{count}</span>
                                            </Space>
                                        ) : '—';
                                    }
                                },
                                {
                                    title: 'Created',
                                    dataIndex: 'createdAt',
                                    width: 130,
                                    render: (date: string) => (
                                        <Space size={4} style={{ color: colors.textMuted }}>
                                            <ClockCircleOutlined style={{ fontSize: '0.75rem' }} />
                                            <span style={{ fontSize: '0.875rem' }}>
                                                {formatDistanceToNow(date)}
                                            </span>
                                        </Space>
                                    )
                                },
                                {
                                    title: 'Creator',
                                    dataIndex: 'user',
                                    width: 80,
                                    align: 'center' as const,
                                    render: (user: any) => (
                                        <Tooltip title={user?.username || 'Unknown'}>
                                            <Avatar 
                                                size="small" 
                                                style={{ background: colors.accent, color: '#fff' }}
                                            >
                                                {user?.username?.[0]?.toUpperCase()}
                                            </Avatar>
                                        </Tooltip>
                                    )
                                },
                                {
                                    title: 'Assignee',
                                    dataIndex: 'assignee',
                                    width: 100,
                                    align: 'center' as const,
                                    render: (assignee: any, task: Task) => {
                                        if (isOwner) {
                                            return (
                                                <Select
                                                    size="small"
                                                    placeholder="Assign"
                                                    value={task.assigneeId ?? undefined}
                                                    onChange={(val) => handleAssign(task.id, val ?? null)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    options={memberOptions}
                                                    allowClear
                                                    style={{ width: 90 }}
                                                />
                                            );
                                        }
                                        return assignee ? (
                                            <Tooltip title={`Assigned to ${assignee.username}`}>
                                                <Avatar size="small" style={{ background: colors.accent, color: '#fff' }}>
                                                    {assignee.username?.[0]?.toUpperCase()}
                                                </Avatar>
                                            </Tooltip>
                                        ) : (
                                            <span style={{ color: colors.textMuted, fontSize: '0.75rem' }}>—</span>
                                        );
                                    }
                                },
                                {
                                    title: '',
                                    key: 'actions',
                                    width: 50,
                                    align: 'center' as const,
                                    render: (_: any, task: Task) => {
                                        const dropdownItems = [
                                            {
                                                key: 'edit',
                                                icon: <EditOutlined />,
                                                label: 'Edit',
                                                onClick: () => navigate(`/tasks/${task.id}?workspace=${workspace.id}`),
                                            },
                                            {
                                                key: 'delete',
                                                icon: <DeleteOutlined />,
                                                label: 'Delete',
                                                danger: true,
                                                onClick: () => {
                                                    Modal.confirm({
                                                        title: 'Delete task',
                                                        content: 'Are you sure you want to delete this task?',
                                                        okText: 'Delete',
                                                        okButtonProps: { danger: true },
                                                        cancelText: 'Cancel',
                                                        onOk: () => console.log('Delete task', task.id),
                                                    });
                                                },
                                            },
                                        ];
                                        return (
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
                                                            color: '#a3a3a3',
                                                        }}
                                                        className="hover:bg-gray-200"
                                                    >
                                                        <EllipsisOutlined style={{ fontSize: 16 }} />
                                                    </div>
                                                </Dropdown>
                                            </div>
                                        );
                                    }
                                }
                            ]}
                        />
                    )}
                </>
            )}

            <Modal
                open={createOpen}
                onCancel={() => { setCreateOpen(false); form.resetFields(); }}
                footer={null}
                title={<span style={{ color: colors.text }}>New Task</span>}
                style={{ top: 20 }}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-2">
                    <Form.Item
                        name="title"
                        label={<span style={{ color: colors.text }}>Title</span>}
                        rules={[{ required: true, message: "Title is required" }]}
                    >
                        <Input placeholder="What needs to be done?" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={<span style={{ color: colors.text }}>Description</span>}
                    >
                        <Input.TextArea placeholder="Optional details..." rows={3} />
                    </Form.Item>
                    {isOwner && (
                        <Form.Item
                            name="assigneeId"
                            label={<span style={{ color: colors.text }}>Assign to</span>}
                        >
                            <Select placeholder="Select a member" options={memberOptions} allowClear />
                        </Form.Item>
                    )}
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={createTask.isPending}
                        style={{ background: colors.accent, borderColor: colors.accent }}
                    >
                        Create Task
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default WorkspaceTaskList;