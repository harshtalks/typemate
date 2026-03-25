import { createFileRoute, Outlet } from "@tanstack/react-router";
import { membersRepo } from "~/rpcs/members";

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

    return { workspaceMember: member };
  },
});

function RouteComponent() {
  return <Outlet />;
}
