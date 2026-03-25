import { eq, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import type { Invitation } from "@typemate/db/schema";
import { Branded } from "@typemate/types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import { EmptyIcon } from "@typemate/ui/components/icons";
import { Array, pipe } from "effect";
import { invitationsCollection } from "~/queries/invitations";
import { LiveQueryWrapper } from "../shared/live-query-wrapper";
import { NonEmptyArray } from "../utils/array";
import AddNewMembersToWorkspace from "./add-new-members";
import InvitationCard from "./invitation-card";

const Invitations = () => {
  const { workspaceId } = useParams({
    from: "/(authenticated)/workspaces/$workspaceId/",
  });

  const liveQuery = useLiveQuery((query) =>
    query
      .from({ invitation: invitationsCollection })
      .where(({ invitation }) =>
        eq(invitation.organizationId, Branded.OrganizationId(workspaceId))
      )
  );

  return (
    <LiveQueryWrapper query={liveQuery}>
      <LiveQueryWrapper.Error />
      <LiveQueryWrapper.Loading />
      <LiveQueryWrapper.Ready>
        {(invitations: Invitation[]) => (
          <NonEmptyArray data={invitations}>
            <NonEmptyArray.WhenEmpty>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <EmptyIcon className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle>No Invitations</EmptyTitle>
                  <EmptyDescription>
                    You don&apos;t have any invitations for this workspace yet.
                    Create one now.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <AddNewMembersToWorkspace />
                </EmptyContent>
              </Empty>
            </NonEmptyArray.WhenEmpty>
            <NonEmptyArray.WhenNonEmpty>
              {(invitation) => (
                <div className="space-y-8">
                  {pipe(
                    invitation,
                    Array.map((invitation: Invitation) => (
                      <InvitationCard
                        invitation={invitation}
                        key={invitation.id}
                      />
                    ))
                  )}
                  <AddNewMembersToWorkspace />
                </div>
              )}
            </NonEmptyArray.WhenNonEmpty>
          </NonEmptyArray>
        )}
      </LiveQueryWrapper.Ready>
    </LiveQueryWrapper>
  );
};

export default Invitations;
