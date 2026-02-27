import { useRemoveMember } from "../../../hooks/useWorkspace";
import WorkspaceMemberItem from "../../molecules/WorkspaceMemberItem";
import type { Workspace, WorkspaceMember } from "../../../types";

interface WorkspaceMemberListProps {
    workspace: Workspace;
    currentUserId: string;
}

const WorkspaceMemberList = ({ workspace, currentUserId }: WorkspaceMemberListProps) => {
    const isOwner = workspace.ownerId === currentUserId;
    const { mutate: removeMember } = useRemoveMember(workspace.id);

    return (
        <div className="space-y-1">
            {workspace.members?.map((member: WorkspaceMember) => (
                <WorkspaceMemberItem
                    key={member.id}
                    member={member}
                    isOwner={isOwner}
                    currentUserId={currentUserId}
                    onRemove={isOwner ? (userId) => removeMember(userId) : undefined}
                />
            ))}
        </div>
    );
};

export default WorkspaceMemberList;