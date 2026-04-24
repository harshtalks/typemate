import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import { SpinnerIcon } from "@typemate/ui/components/icons";
import { projectsRepo } from "~/rpcs/projects";

export const Route = createFileRoute(
  "/(authenticated)/workspaces/$workspaceId/projects/$projectId"
)({
  component: RouteComponent,
  beforeLoad: async ({ params: { projectId } }) => {
    const project = await projectsRepo.get({ data: { id: projectId } });

    if (!project) {
      redirect({ to: "/workspaces" });
    }

    return { project };
  },
  pendingComponent: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <SpinnerIcon className="animate-spin" />
        </EmptyMedia>
        <EmptyTitle>Loading project...</EmptyTitle>
        <EmptyDescription>
          Please wait while we load your project
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
});

function RouteComponent() {
  return <Outlet />;
}
