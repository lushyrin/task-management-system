import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Result, Popconfirm, Form, Input } from "antd";
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { useWorkspace, useUpdateWorkspace, useDeleteWorkspace } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import WorkspaceMemberList from "@/components/organisms/WorkspaceMemberList";
import InviteCodeCard from "@/components/molecules/InviteCodeCard";
import { useState } from "react";

const c = {
    text: '#171717',
    textMuted: '#737373',
    textLight: '#a3a3a3',
    accent: '#eab308',
    accentDim: '#fef9c3',
    border: '#e5e5e5',
    bg: '#ffffff',
    bgSubtle: '#fafafa',
    danger: '#ef4444',
    dangerBg: '#fef2f2',
    dangerBorder: '#fecaca',
};

const SectionCard = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        ...style,
    }}>
        {children}
    </div>
);

const SectionHeader = ({
    title,
    sub,
    action,
}: {
    title: React.ReactNode;
    sub?: string;
    action?: React.ReactNode;
}) => (
    <div style={{
        padding: '16px 24px',
        borderBottom: `1px solid ${c.border}`,
        background: c.bgSubtle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    }}>
        <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: c.text }}>{title}</p>
            {sub && <p style={{ margin: '2px 0 0', fontSize: 13, color: c.textMuted }}>{sub}</p>}
        </div>
        {action}
    </div>
);

const inputStyle: React.CSSProperties = {
    borderRadius: 10,
    borderColor: c.border,
    fontSize: 14,
    color: c.text,
    background: c.bg,
};

const WorkspaceSettings = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: workspace, isLoading, isError } = useWorkspace(id!);
    const updateMutation = useUpdateWorkspace(id!);
    const deleteMutation = useDeleteWorkspace();
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    if (isLoading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10rem 0' }}>
            <Spin size="large" />
        </div>
    );

    if (isError || !workspace) return (
        <Result
            status="403"
            title="Access denied"
            extra={<Button onClick={() => navigate('/tasks')}>Go Home</Button>}
        />
    );

    const isOwner = workspace.ownerId === user?.id;
    if (!isOwner) return (
        <Result
            status="403"
            title="Only the owner can access settings"
            extra={<Button onClick={() => navigate(`/workspace/${id}`)}>Back</Button>}
        />
    );

    const handleEdit = () => {
        form.setFieldsValue({ name: workspace.name, description: workspace.description });
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleUpdate = async (values: { name: string; description?: string }) => {
        await updateMutation.mutateAsync(values);
        setEditing(false);
    };

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(id!);
        navigate('/tasks');
    };

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 32 }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                    onClick={() => navigate(`/workspace/${id}`)}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 36, height: 36, borderRadius: 10,
                        border: `1px solid ${c.border}`, background: c.bg,
                        cursor: 'pointer', color: c.textMuted, flexShrink: 0,
                        transition: 'background 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = '#f5f5f5';
                        (e.currentTarget as HTMLElement).style.borderColor = '#d4d4d4';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = c.bg;
                        (e.currentTarget as HTMLElement).style.borderColor = c.border;
                    }}
                >
                    <ArrowLeftOutlined style={{ fontSize: 13 }} />
                </button>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: c.text, letterSpacing: '-0.02em' }}>
                        Settings
                    </h1>
                    <p style={{ margin: 0, fontSize: 13, color: c.textMuted }}>{workspace.name}</p>
                </div>
            </div>

            {/* ── General ── */}
            <SectionCard>
                <SectionHeader
                    title="General"
                    sub="Workspace name and description"
                    action={
                        !editing ? (
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                                style={{ borderRadius: 8, borderColor: c.border, color: c.text, fontSize: 13 }}
                            >
                                Edit
                            </Button>
                        ) : null
                    }
                />

                <div style={{ padding: '20px 24px' }}>
                    {editing ? (
                        <Form form={form} layout="vertical" onFinish={handleUpdate}>
                            <Form.Item
                                name="name"
                                label={<span style={{ fontSize: 13, fontWeight: 500, color: c.text }}>Workspace name</span>}
                                rules={[{ required: true, message: 'Name is required' }]}
                                style={{ marginBottom: 16 }}
                            >
                                <Input style={inputStyle} />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={
                                    <span style={{ fontSize: 13, fontWeight: 500, color: c.text }}>
                                        Description{' '}
                                        <span style={{ color: c.textLight, fontWeight: 400 }}>(optional)</span>
                                    </span>
                                }
                                style={{ marginBottom: 20 }}
                            >
                                <Input.TextArea rows={3} style={{ ...inputStyle, resize: 'none' }} />
                            </Form.Item>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={updateMutation.isPending}
                                    style={{
                                        background: c.accent,
                                        borderColor: c.accent,
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        boxShadow: 'none',
                                        color: '#fff',
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={handleCancel}
                                    style={{ borderRadius: 8, borderColor: c.border, color: c.textMuted }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: 12, color: c.textLight, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Name</p>
                                <p style={{ margin: 0, fontSize: 14, color: c.text, fontWeight: 500 }}>{workspace.name}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: 12, color: c.textLight, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Description</p>
                                <p style={{ margin: 0, fontSize: 14, color: workspace.description ? c.textMuted : c.textLight, fontStyle: workspace.description ? 'normal' : 'italic' }}>
                                    {workspace.description || 'No description'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </SectionCard>

            <SectionCard>
                <SectionHeader title="Invite" sub="Share this code so teammates can join" />
                <div style={{ padding: '20px 24px' }}>
                    <InviteCodeCard
                        workspaceId={workspace.id}
                        inviteCode={workspace.inviteCode}
                        isOwner={isOwner}
                    />
                </div>
            </SectionCard>

            <SectionCard>
                <SectionHeader
                    title={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            Members
                            <span style={{
                                background: c.accentDim,
                                color: '#92400e',
                                fontSize: 12,
                                fontWeight: 600,
                                padding: '1px 8px',
                                borderRadius: 99,
                                border: '1px solid #fde68a',
                            }}>
                                {workspace.members?.length ?? 0}
                            </span>
                        </span>
                    }
                    sub="Manage who has access to this workspace"
                />
                <WorkspaceMemberList workspace={workspace} currentUserId={user?.id ?? ''} />
            </SectionCard>

            <SectionCard style={{ borderColor: c.dangerBorder }}>
                <SectionHeader
                    title={
                        <span style={{ color: c.danger, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <WarningOutlined style={{ fontSize: 13 }} />
                            Danger Zone
                        </span>
                    }
                />
                <div style={{
                    padding: '20px 24px',
                    background: c.dangerBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                }}>
                    <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: c.text }}>Delete this workspace</p>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: c.textMuted }}>
                            Permanently removes the workspace and all its tasks. This cannot be undone.
                        </p>
                    </div>
                    <Popconfirm
                        title="Delete workspace?"
                        description="All tasks and members will be removed. This cannot be undone."
                        onConfirm={handleDelete}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        placement="topRight"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            loading={deleteMutation.isPending}
                            style={{ borderRadius: 8, fontWeight: 500, flexShrink: 0 }}
                        >
                            Delete workspace
                        </Button>
                    </Popconfirm>
                </div>
            </SectionCard>

        </div>
    );
};

export default WorkspaceSettings;