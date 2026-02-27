import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Result, Radio, Typography } from "antd";
import {
    SettingOutlined,
    TeamOutlined,
    ArrowLeftOutlined,
    AppstoreAddOutlined,
    UnorderedListOutlined,
    ColumnHeightOutlined,
} from "@ant-design/icons";
import { useWorkspace, useWorkspaceTasks } from "../../hooks/useWorkspace";
import { useAuth } from "../../hooks/useAuth";
import WorkspaceTaskList from "../../components/organisms/WorkspaceTaskList";
import KanbanBoard from "../../components/organisms/KanbanBoard";

const colors = {
    text: '#171717',
    textMuted: '#737373',
    accent: '#eab308',
    border: '#e5e5e5',
};

type ViewMode = 'list' | 'grid' | 'kanban';

const { Title, Text } = Typography;

const WorkspacePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: workspace, isLoading, isError } = useWorkspace(id!);
    const { data: tasks } = useWorkspaceTasks(id!);

    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full py-40">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !workspace) {
        return (
            <Result
                status="404"
                title="Workspace not found"
                subTitle="This workspace doesn't exist or you don't have access."
                extra={
                    <Button onClick={() => navigate("/tasks")}>Back to My Tasks</Button>
                }
            />
        );
    }

    const isOwner = workspace.ownerId === user?.id;
    const memberCount = workspace.members?.length ?? 0;

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: colors.textMuted }}
                    >
                        <ArrowLeftOutlined />
                    </button>
                    <div>
                        <Title level={2} style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700, color: colors.text }}>
                            {workspace.name}
                        </Title>
                        <div className="flex items-center gap-4 mt-2">
                            {workspace.description && (
                                <Text style={{ color: colors.textMuted }}>{workspace.description}</Text>
                            )}
                            <span style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
                                <TeamOutlined /> {memberCount} {memberCount === 1 ? "member" : "members"}
                            </span>
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <Button
                        icon={<SettingOutlined />}
                        onClick={() => navigate(`/workspace/${workspace.id}/settings`)}
                        style={{ borderColor: colors.border, color: colors.text }}
                    >
                        Settings
                    </Button>
                )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
                <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    buttonStyle="solid"
                >
                    <Radio.Button
                        value="grid"
                        style={viewMode === 'grid' ? { background: colors.accent, borderColor: colors.accent, color: 'white' } : {}}
                    >
                        <AppstoreAddOutlined />
                    </Radio.Button>
                    <Radio.Button
                        value="list"
                        style={viewMode === 'list' ? { background: colors.accent, borderColor: colors.accent, color: 'white' } : {}}
                    >
                        <UnorderedListOutlined />
                    </Radio.Button>
                    <Radio.Button
                        value="kanban"
                        style={viewMode === 'kanban' ? { background: colors.accent, borderColor: colors.accent, color: 'white' } : {}}
                    >
                        <ColumnHeightOutlined />
                    </Radio.Button>
                </Radio.Group>
            </div>

            {/* Tasks View */}
            {viewMode === 'kanban' ? (
                <KanbanBoard tasks={tasks || []} />
            ) : (
                <WorkspaceTaskList
                    workspace={workspace}
                    currentUserId={user?.id ?? ""}
                    viewMode={viewMode}
                />
            )}
        </div>
    );
};

export default WorkspacePage;