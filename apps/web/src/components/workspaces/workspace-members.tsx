import { eq, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import { membersCollection } from "~/queries/members";
import type { MemberWithUser } from "~/rpcs/members/validator";
import { LiveQueryWrapper } from "../shared/live-query-wrapper";
import AddNewMembersToWorkspace from "./add-new-members";
import MemberCard from "./member-card";

const WorkspaceMembers = () => {
  const { workspaceId } = useParams({
    from: "/(authenticated)/workspaces/$workspaceId",
  });

  const liveQuery = useLiveQuery((query) =>
    query
      .from({ member: membersCollection })
      .where(({ member }) => eq(member.member.organizationId, workspaceId))
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl">Workspace Members</h2>
      <LiveQueryWrapper query={liveQuery}>
        <LiveQueryWrapper.Loading />
        <LiveQueryWrapper.Error />
        <LiveQueryWrapper.Ready>
          {(members: MemberWithUser[]) => (
            <div className="space-y-4">
              {members.map((member) => (
                <MemberCard key={member.member.id} member={member} />
              ))}
            </div>
          )}
        </LiveQueryWrapper.Ready>
      </LiveQueryWrapper>
      <AddNewMembersToWorkspace />
    </div>
  );
};

export default WorkspaceMembers;
