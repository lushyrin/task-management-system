import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    PlusOutlined,
    ColumnHeightOutlined,
    LogoutOutlined,
    TeamOutlined,
    LoginOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { Modal, Form, Input, Tabs, Spin, Tooltip, Avatar, Button } from "antd";
import { useWorkspaces, useCreateWorkspace, useJoinWorkspace } from "../../../hooks/useWorkspace";
import { useAuth } from "../../../hooks/useAuth";
import WorkspaceCard from "../../molecules/WorkspaceCard";

const colors = {
    sidebarBg: '#fafafa',
    bgHover: '#f5f5f5',
    border: '#e5e5e5',
    text: '#171717',
    textMuted: '#737373',
    textSecondary: '#525252',
    accent: '#eab308',
    accentLight: '#fef9c3',
    white: '#ffffff',
};

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { data: workspaces, isLoading } = useWorkspaces();

    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("create");
    const [form] = Form.useForm();

    const createMutation = useCreateWorkspace();
    const joinMutation = useJoinWorkspace();

    const isPersonalTasks = location.pathname === "/tasks" || location.pathname.startsWith("/tasks");
    const isPersonalKanban = location.pathname === "/kanban";
    const activeWorkspaceId = location.pathname.startsWith("/workspace/")
        ? location.pathname.split("/")[2]
        : null;
    const isWorkspaceSettings = location.pathname.includes("/settings");

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        form.resetFields();
    };

    const handleSubmit = async (values: Record<string, string>) => {
        console.log("Form submitted:", values);
        console.log("Active tab:", activeTab);
        console.log("Form getFieldValue('inviteCode'):", form.getFieldValue('inviteCode'));
        if (activeTab === "create") {
            await createMutation.mutateAsync({ name: values.name, description: values.description });
        } else {
            const inviteCode = values.inviteCode?.trim();
            console.log("Joining with invite code:", inviteCode);
            if (!inviteCode) {
                console.error("Invite code is empty!");
                return;
            }
            await joinMutation.mutateAsync({ inviteCode });
        }
        setModalOpen(false);
        form.resetFields();
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setActiveTab("create");
        form.resetFields();
    };

    const NavItem = ({
        icon,
        label,
        isActive,
        onClick,
    }: {
        icon: React.ReactNode;
        label: string;
        isActive: boolean;
        onClick: () => void;
    }) => (
        <div
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 mx-2"
            style={{
                background: isActive ? colors.accent : 'transparent',
                color: isActive ? colors.white : colors.text,
            }}
            onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = colors.bgHover;
            }}
            onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
        >
            <span className="text-base shrink-0">{icon}</span>
            <span className="text-sm font-medium flex-1">{label}</span>
        </div>
    );

    return (
        <>
            <aside
                className="w-64 shrink-0 flex flex-col h-screen sticky top-0"
                style={{ background: colors.sidebarBg, borderRight: `1px solid ${colors.border}` }}
            >

                <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <img src="/logo.png" alt="MiniTask" style={{ height: 32, width: 32 }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.text }}>
                        MiniTask
                    </span>
                </div>


                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-5 mb-2">
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Personal
                        </span>
                    </div>

                    <NavItem
                        icon={<UnorderedListOutlined />}
                        label="My Tasks"
                        isActive={isPersonalTasks && !isPersonalKanban}
                        onClick={() => navigate("/tasks")}
                    />

                    <NavItem
                        icon={<ColumnHeightOutlined />}
                        label="Kanban Board"
                        isActive={isPersonalKanban}
                        onClick={() => navigate("/kanban")}
                    />

                    <div className="mt-6">
                        <div className="px-5 mb-2 flex items-center justify-between">
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Workspaces
                            </span>
                            <Tooltip title="Create or join">
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                                    style={{ background: colors.accent, color: colors.white }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ca8a04'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = colors.accent; }}
                                >
                                    <PlusOutlined style={{ fontSize: 12 }} />
                                </button>
                            </Tooltip>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <Spin size="small" />
                            </div>
                        ) : workspaces && workspaces.length > 0 ? (
                            <div className="space-y-0.5">
                                {workspaces.map((ws) => (
                                    <WorkspaceCard
                                        key={ws.id}
                                        workspace={ws}
                                        isActive={activeWorkspaceId === ws.id && !isWorkspaceSettings}
                                        onClick={() => navigate(`/workspace/${ws.id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="px-5 py-4 text-center">
                                <TeamOutlined style={{ fontSize: '1.25rem', color: colors.textMuted, marginBottom: 8, display: 'block' }} />
                                <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>No workspaces</p>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    style={{ fontSize: '0.75rem', color: colors.accent, marginTop: 4, fontWeight: 500 }}
                                >
                                    Create one
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="p-3" style={{ borderTop: `1px solid ${colors.border}` }}>
                    <div
                        className="px-3 py-3 rounded-lg flex items-center gap-3 cursor-pointer"
                        style={{ background: colors.white, border: `1px solid ${colors.border}` }}
                    >
                        <Avatar size="small" style={{ background: colors.accent, color: colors.white, fontWeight: 600 }}>
                            {user?.username?.[0]?.toUpperCase() ?? "?"}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: colors.text }}>{user?.username}</p>
                            <p className="text-xs truncate" style={{ color: colors.textMuted }}>{user?.email}</p>
                        </div>
                        <Tooltip title="Logout">
                            <button
                                onClick={logout}
                                style={{ color: colors.textMuted, padding: '4px' }}
                                className="hover:text-red-500 transition-colors"
                            >
                                <LogoutOutlined />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </aside>

            <Modal
                open={modalOpen}
                onCancel={handleCloseModal}
                footer={null}
                title={<span style={{ color: colors.text, fontWeight: 600 }}>Workspace</span>}
                style={{ top: 20 }}
                destroyOnClose
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    items={[
                        { key: "create", label: "Create", icon: <PlusOutlined /> },
                        { key: "join", label: "Join", icon: <LoginOutlined /> },
                    ]}
                />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-4"
                    initialValues={{ name: '', description: '', inviteCode: '' }}
                >
                    {activeTab === "create" ? (
                        <>
                            <Form.Item
                                name="name"
                                label={<span style={{ color: colors.text }}>Workspace Name</span>}
                                rules={[{ required: true, message: "Name is required" }]}
                            >
                                <Input placeholder="e.g. Design Team" />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={<span style={{ color: colors.text }}>Description</span>}
                            >
                                <Input.TextArea placeholder="What is this workspace for?" rows={3} />
                            </Form.Item>
                        </>
                    ) : (
                        <Form.Item
                            name="inviteCode"
                            label={<span style={{ color: colors.text }}>Invite Code</span>}
                            rules={[{ required: true, message: "Invite code is required" }]}
                        >
                            <Input placeholder="e.g. A3F9B21C" className="font-mono tracking-widest" />
                        </Form.Item>
                    )}

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={createMutation.isPending || joinMutation.isPending}
                        style={{ background: colors.accent, borderColor: colors.accent }}
                    >
                        {activeTab === "create" ? "Create Workspace" : "Join Workspace"}
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default Sidebar;