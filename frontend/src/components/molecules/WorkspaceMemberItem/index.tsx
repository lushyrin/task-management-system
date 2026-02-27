import { Avatar, Tag, Popconfirm, Button, Tooltip } from "antd";
import { UserDeleteOutlined, CrownOutlined } from "@ant-design/icons";
import type { WorkspaceMember } from "../../../types";

// Clean color palette
const colors = {
    text: '#171717',
    textMuted: '#737373',
    accent: '#eab308',
    bgHover: '#f5f5f5',
};

interface WorkspaceMemberItemProps {
    member: WorkspaceMember;
    isOwner: boolean;
    currentUserId: string;
    onRemove?: (userId: string) => void;
}

const WorkspaceMemberItem = ({
    member,
    isOwner,
    currentUserId,
    onRemove,
}: WorkspaceMemberItemProps) => {
    const isCurrentUser = member.userId === currentUserId;
    const isMemberOwner = member.role === "owner";

    return (
        <div 
            className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Avatar style={{ background: colors.accent, color: '#fff', fontWeight: 600 }}>
                    {member.user.username?.[0]?.toUpperCase() ?? "?"}
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                        <span style={{ color: colors.text, fontWeight: 500 }}>
                            {member.user.username}
                            {isCurrentUser && (
                                <span style={{ color: colors.textMuted, fontSize: '0.75rem', marginLeft: 4 }}>(you)</span>
                            )}
                        </span>
                        {isMemberOwner && (
                            <Tooltip title="Owner">
                                <CrownOutlined style={{ color: colors.accent }} />
                            </Tooltip>
                        )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>{member.user.email}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Tag
                    color={isMemberOwner ? "gold" : "blue"}
                    style={{ textTransform: 'capitalize' }}
                >
                    {member.role}
                </Tag>
                {isOwner && !isMemberOwner && onRemove && (
                    <Popconfirm
                        title="Remove member"
                        description="Are you sure you want to remove this member?"
                        onConfirm={() => onRemove(member.userId)}
                        okText="Remove"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<UserDeleteOutlined />}
                        />
                    </Popconfirm>
                )}
            </div>
        </div>
    );
};

export default WorkspaceMemberItem;
