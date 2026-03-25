import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import { SpinnerIcon } from "@typemate/ui/components/icons";
import { membersRepo } from "~/rpcs/members";
import { workspacesRepo } from "~/rpcs/workspaces";

export const Route = createFileRoute(
  "/(authenticated)/workspaces/$workspaceId"
)({
  component: RouteComponent,
  beforeLoad: async ({ context, params: { workspaceId } }) => {
    const {
      queryKeyFactory,
      queryClient,
      user: {
        user: { id: userId },
      },
    } = context;

    const member = await queryClient.ensureQueryData({
      queryKey: queryKeyFactory.keys.member(workspaceId, userId),
      queryFn: () =>
        membersRepo.getCurrentWorkspaceCurrentUserMember({
          data: { userId, workspaceId },
        }),
      revalidateIfStale: true,
    });

    const workspace = await queryClient.ensureQueryData({
      queryKey: queryKeyFactory.keys.workspaces(workspaceId),
      queryFn: () =>
        workspacesRepo.get({
          data: { id: workspaceId },
        }),
    });

    if (!(workspace && member)) {
      redirect({ to: "/workspaces" });
    }

    return { workspaceMember: member, workspace };
  },
  pendingComponent: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <SpinnerIcon className="animate-spin" />
        </EmptyMedia>
        <EmptyTitle>Loading..</EmptyTitle>
        <EmptyDescription>Please wait while we load your data</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
});

function RouteComponent() {
  return <Outlet />;
}
