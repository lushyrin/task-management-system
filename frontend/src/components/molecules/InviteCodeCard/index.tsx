import { CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import { useRefreshInviteCode } from "@/hooks/useWorkspace";

const colors = {
    text: '#171717',
    textMuted: '#737373',
    accent: '#eab308',
    border: '#e5e5e5',
    bg: '#fafafa',
};

interface InviteCodeCardProps {
    workspaceId: string;
    inviteCode: string;
    isOwner: boolean;
}

const InviteCodeCard = ({ workspaceId, inviteCode, isOwner }: InviteCodeCardProps) => {
    const { mutate: refresh, isPending } = useRefreshInviteCode(workspaceId);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        message.success("Invite code copied!");
    };

    return (
        <div
            className="rounded-xl p-4"
            style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
        >
            <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Invite Code
            </p>
            <div className="flex items-center gap-2">
                <code
                    className="flex-1 font-mono text-lg font-bold px-4 py-2 rounded-lg tracking-widest"
                    style={{ background: '#fff', color: colors.accent, border: `1px solid ${colors.border}` }}
                >
                    {inviteCode}
                </code>
                <Tooltip title="Copy code">
                    <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={handleCopy}
                        style={{ color: colors.text }}
                    />
                </Tooltip>
                {isOwner && (
                    <Tooltip title="Generate new code">
                        <Button
                            type="text"
                            icon={<ReloadOutlined spin={isPending} />}
                            loading={isPending}
                            onClick={() => refresh()}
                            style={{ color: colors.text }}
                        />
                    </Tooltip>
                )}
            </div>
            <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: 8 }}>
                Share this code with teammates so they can join your workspace.
            </p>
        </div>
    );
};

export default InviteCodeCard;
