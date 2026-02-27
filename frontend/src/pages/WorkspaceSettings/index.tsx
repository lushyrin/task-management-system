import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Result, Popconfirm, Form, Input } from "antd";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useWorkspace, useUpdateWorkspace, useDeleteWorkspace } from "../../hooks/useWorkspace";
import { useAuth } from "../../hooks/useAuth";
import WorkspaceMemberList from "../../components/organisms/WorkspaceMemberList";
import InviteCodeCard from "../../components/molecules/InviteCodeCard";
import { useState } from "react";

// Clean color palette
const colors = {
    text: '#171717',
    textMuted: '#737373',
    accent: '#eab308',
    border: '#e5e5e5',
    bg: '#fafafa',
    danger: '#ef4444',
};

const WorkspaceSettings = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: workspace, isLoading, isError } = useWorkspace(id!);

    const updateMutation = useUpdateWorkspace(id!);
    const deleteMutation = useDeleteWorkspace();

    const [editingName, setEditingName] = useState(false);
    const [form] = Form.useForm();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-40">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !workspace) {
        return (
            <Result
                status="403"
                title="Access denied"
                extra={<Button onClick={() => navigate("/tasks")}>Go Home</Button>}
            />
        );
    }

    const isOwner = workspace.ownerId === user?.id;

    if (!isOwner) {
        return (
            <Result
                status="403"
                title="Only the owner can access settings"
                extra={<Button onClick={() => navigate(`/workspace/${id}`)}>Back</Button>}
            />
        );
    }

    const handleUpdate = async (values: { name: string; description?: string }) => {
        await updateMutation.mutateAsync(values);
        setEditingName(false);
    };

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(id!);
        navigate("/tasks");
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(`/workspace/${id}`)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{ color: colors.textMuted }}
                >
                    <ArrowLeftOutlined />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: colors.text, margin: 0 }}>Workspace Settings</h1>
                    <p style={{ color: colors.textMuted }}>{workspace.name}</p>
                </div>
            </div>

            {/* General */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text }}>General</h2>
                    {!editingName && (
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEditingName(true);
                                form.setFieldsValue({ name: workspace.name, description: workspace.description });
                            }}
                            style={{ borderColor: colors.border, color: colors.text }}
                        >
                            Edit
                        </Button>
                    )}
                </div>

                {editingName ? (
                    <Form 
                        form={form} 
                        layout="vertical" 
                        onFinish={handleUpdate} 
                        className="rounded-xl p-4"
                        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                    >
                        <Form.Item
                            name="name"
                            label={<span style={{ color: colors.text }}>Name</span>}
                            rules={[{ required: true, message: "Name is required" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={<span style={{ color: colors.text }}>Description</span>}
                        >
                            <Input.TextArea rows={2} />
                        </Form.Item>
                        <div className="flex gap-2">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={updateMutation.isPending}
                                style={{ background: colors.accent, borderColor: colors.accent }}
                            >
                                Save
                            </Button>
                            <Button onClick={() => setEditingName(false)}>Cancel</Button>
                        </div>
                    </Form>
                ) : (
                    <div 
                        className="rounded-xl p-4 space-y-2"
                        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                    >
                        <div>
                            <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginBottom: 4 }}>Name</p>
                            <p style={{ color: colors.text, fontWeight: 500 }}>{workspace.name}</p>
                        </div>
                        {workspace.description && (
                            <div>
                                <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginBottom: 4 }}>Description</p>
                                <p style={{ color: colors.textMuted }}>{workspace.description}</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Invite Code */}
            <section>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text, marginBottom: 12 }}>Invite</h2>
                <InviteCodeCard
                    workspaceId={workspace.id}
                    inviteCode={workspace.inviteCode}
                    isOwner={isOwner}
                />
            </section>

            {/* Members */}
            <section>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text, marginBottom: 12 }}>
                    Members
                    <span style={{ marginLeft: 8, fontSize: '0.875rem', color: colors.textMuted, fontWeight: 400 }}>
                        {workspace.members?.length ?? 0}
                    </span>
                </h2>
                <div 
                    className="rounded-xl py-2"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                >
                    <WorkspaceMemberList workspace={workspace} currentUserId={user?.id ?? ""} />
                </div>
            </section>

            {/* Danger Zone */}
            <section>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.danger, marginBottom: 12 }}>Danger Zone</h2>
                <div 
                    className="rounded-xl p-4 flex items-center justify-between"
                    style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
                >
                    <div>
                        <p style={{ fontWeight: 500, color: colors.text }}>Delete this workspace</p>
                        <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: 4 }}>
                            This action cannot be undone. All tasks will be permanently deleted.
                        </p>
                    </div>
                    <Popconfirm
                        title="Delete workspace?"
                        description="All tasks and members will be removed. This cannot be undone."
                        onConfirm={handleDelete}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            loading={deleteMutation.isPending}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            </section>
        </div>
    );
};

export default WorkspaceSettings;
