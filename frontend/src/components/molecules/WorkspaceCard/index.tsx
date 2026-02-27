import { TeamOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import type { WorkspaceCardProps } from "./WorkspaceCard.types";

const colors = {
    text: '#171717',
    textMuted: '#737373',
    accent: '#eab308',
    bgHover: '#f5f5f5',
    white: '#ffffff',
};

const WorkspaceCard = ({ workspace, isActive, onClick }: WorkspaceCardProps) => {
    const initials = workspace.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 mx-2"
            style={{
                background: isActive ? colors.accent : 'transparent',
                color: isActive ? colors.white : colors.text,
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.currentTarget.style.background = colors.bgHover;
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                }
            }}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : colors.bgHover,
                    color: isActive ? colors.white : colors.text,
                }}
            >
                {initials || <TeamOutlined />}
            </div>
            <Tooltip title={workspace.name} placement="right">
                <span className="text-sm font-medium truncate">{workspace.name}</span>
            </Tooltip>
        </div>
    );
};

export default WorkspaceCard;
