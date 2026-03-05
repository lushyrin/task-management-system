import { useState } from "react";
import { Button, Form, Input, Modal, Select, Empty, Tag, Avatar, Tooltip, List, Card, Space, Dropdown, Table, Spin } from "antd";
import { PlusOutlined, MessageOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useWorkspaceTasks, useCreateWorkspaceTask, useAssignTask } from "@/hooks/useWorkspace";
import { workspaceService } from "@/services/workspace.service";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "@/utils/helpers";
import { STATUS_CONFIG } from "@/utils/uiConfig";
import type { Task, Workspace, WorkspaceMember, TaskStatus } from "@/types";

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

interface WorkspaceTaskListProps {
    workspace: Workspace;
    currentUserId: string;
    viewMode?: 'list' | 'grid';
}

const WorkspaceTaskList = ({ workspace, currentUserId, viewMode = 'grid' }: WorkspaceTaskListProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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

    const handleDelete = (task: Task) => {
        Modal.confirm({
            title: 'Delete task',
            content: 'Are you sure you want to delete this task?',
            okText: 'Delete',
            okButtonProps: { danger: true },
            cancelText: 'Cancel',
            onOk: async () => {
                await workspaceService.deleteTask(workspace.id, task.id);
                queryClient.invalidateQueries({ queryKey: ['workspaces', workspace.id, 'tasks'] });
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    const buildDropdownItems = (task: Task) => [
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
            onClick: () => handleDelete(task),
        },
    ];

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

            {/* ── GRID ── */}
            {viewMode === 'grid' && (
                !tasks || tasks.length === 0 ? (
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
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Tag color={statusConfig.color} icon={statusConfig.icon}>
                                                    {statusConfig.label}
                                                </Tag>
                                            </div>

                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Dropdown menu={{ items: buildDropdownItems(task) }} trigger={['click']} placement="bottomRight">
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
                                        </div>

                                        {/* Body */}
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{
                                                color: colors.text, fontWeight: 600, marginBottom: 6, lineHeight: 1.4,
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                            }}>
                                                {task.title}
                                            </h4>

                                            {/* Fixed 2-line description block — invisible when absent */}
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

                                        {/* Footer */}
                                        <div
                                            className="flex items-center justify-between mt-4 pt-3"
                                            style={{ borderTop: `1px solid ${colors.border}` }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Space size={12}>
                                                <Tooltip title={`Created by ${task.user?.username}`}>
                                                    <Avatar size="small" style={{ background: colors.accent, color: colors.white }}>
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
                                                    <Avatar size="small" style={{ background: colors.accent, color: colors.white }}>
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
                )
            )}

            {/* ── LIST ── */}
            {viewMode === 'list' && (
                !tasks || tasks.length === 0 ? (
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
                            style: { cursor: 'pointer' },
                        })}
                        rowClassName="hover:bg-gray-50"
                        columns={[
                            {
                                title: 'Status', dataIndex: 'status', width: 130,
                                render: (status: TaskStatus) => {
                                    const config = STATUS_CONFIG[status];
                                    return <Tag color={config.color} icon={config.icon}>{config.label}</Tag>;
                                }
                            },
                            {
                                title: 'Title', dataIndex: 'title',
                                render: (text: string, task: Task) => (
                                    // Same two-line pattern as TaskCard list view
                                    <div style={{ minWidth: 200 }}>
                                        <div style={{ fontWeight: 500, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {text}
                                        </div>
                                        <div style={{
                                            color: colors.textMuted, fontSize: '0.75rem',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                            visibility: task.description ? 'visible' : 'hidden',
                                        }}>
                                            {task.description || '\u00A0'}
                                        </div>
                                    </div>
                                )
                            },
                            {
                                title: 'Comments', dataIndex: 'comments', width: 90, align: 'center' as const,
                                render: (_: any, task: Task) => {
                                    const count = task.comments?.length || task.commentCount || 0;
                                    return count > 0 ? (
                                        <Space size={4} style={{ color: colors.textMuted }}><MessageOutlined /><span>{count}</span></Space>
                                    ) : '—';
                                }
                            },
                            {
                                title: 'Created', dataIndex: 'createdAt', width: 130,
                                render: (date: string) => (
                                    <span style={{ color: colors.textMuted, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                        <ClockCircleOutlined style={{ fontSize: '0.75rem', marginRight: 4 }} />
                                        {formatDistanceToNow(date)}
                                    </span>
                                )
                            },
                            {
                                title: 'Creator', dataIndex: 'user', width: 80, align: 'center' as const,
                                render: (user: any) => (
                                    <Tooltip title={user?.username || 'Unknown'}>
                                        <Avatar size="small" style={{ background: colors.accent, color: colors.white }}>
                                            {user?.username?.[0]?.toUpperCase()}
                                        </Avatar>
                                    </Tooltip>
                                )
                            },
                            {
                                title: 'Assignee', dataIndex: 'assignee', width: 100, align: 'center' as const,
                                render: (assignee: any, task: Task) => {
                                    if (isOwner) {
                                        return (
                                            <Select
                                                size="small" placeholder="Assign"
                                                value={task.assigneeId ?? undefined}
                                                onChange={(val) => handleAssign(task.id, val ?? null)}
                                                onClick={(e) => e.stopPropagation()}
                                                options={memberOptions} allowClear style={{ width: 90 }}
                                            />
                                        );
                                    }
                                    return assignee ? (
                                        <Tooltip title={`Assigned to ${assignee.username}`}>
                                            <Avatar size="small" style={{ background: colors.accent, color: colors.white }}>
                                                {assignee.username?.[0]?.toUpperCase()}
                                            </Avatar>
                                        </Tooltip>
                                    ) : <span style={{ color: colors.textMuted, fontSize: '0.75rem' }}>—</span>;
                                }
                            },
                            {
                                title: '', key: 'actions', width: 50, align: 'center' as const,
                                render: (_: any, task: Task) => (
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <Dropdown menu={{ items: buildDropdownItems(task) }} trigger={['click']} placement="bottomRight">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 4, cursor: 'pointer', color: colors.textLight }}
                                                className="hover:bg-gray-200">
                                                <EllipsisOutlined style={{ fontSize: 16 }} />
                                            </div>
                                        </Dropdown>
                                    </div>
                                )
                            },
                        ]}
                    />
                )
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
                    <Form.Item name="title" label={<span style={{ color: colors.text }}>Title</span>}
                        rules={[{ required: true, message: 'Title is required' }]}>
                        <Input placeholder="What needs to be done?" />
                    </Form.Item>
                    <Form.Item name="description" label={<span style={{ color: colors.text }}>Description</span>}>
                        <Input.TextArea placeholder="Optional details..." rows={3} />
                    </Form.Item>
                    {isOwner && (
                        <Form.Item name="assigneeId" label={<span style={{ color: colors.text }}>Assign to</span>}>
                            <Select placeholder="Select a member" options={memberOptions} allowClear />
                        </Form.Item>
                    )}
                    <Button type="primary" htmlType="submit" block loading={createTask.isPending}
                        style={{ background: colors.accent, borderColor: colors.accent }}>
                        Create Task
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default WorkspaceTaskList;