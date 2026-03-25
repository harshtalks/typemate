import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { Organization } from "@typemate/db/schema";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@typemate/ui/components/tabs";
import { Match, pipe } from "effect";
import z from "zod";
import { LiveQueryWrapper } from "~/components/shared/live-query-wrapper";
import Invitations from "~/components/workspaces/invitations";
import WorkspaceMembers from "~/components/workspaces/workspace-members";
import { workspacesCollection } from "~/queries/workspaces";

const searchParamsSchema = z.object({
  tab: z
    .union([
      z.literal("overview"),
      z.literal("members"),
      z.literal("templates"),
      z.literal("settings"),
      z.literal("invitation"),
    ])
    .default("overview"),
});

export type WorkspaceRouteSearchParams = z.infer<typeof searchParamsSchema>;

const tabOptions: {
  label: string;
  value: WorkspaceRouteSearchParams["tab"];
}[] = [
  { label: "Overview", value: "overview" },
  { label: "Members", value: "members" },
  { label: "Templates", value: "templates" },
  { label: "Invitations", value: "invitation" },
  { label: "Settings", value: "settings" },
];

export const Route = createFileRoute(
  "/(authenticated)/workspaces/$workspaceId/"
)({
  component: RouteComponent,
  validateSearch: searchParamsSchema,
});

function RouteComponent() {
  const { tab } = Route.useSearch();
  const { workspaceId } = Route.useParams();
  const navigate = useNavigate();

  const workspaceQuery = useLiveQuery((query) =>
    query
      .from({ workspace: workspacesCollection })
      .where(({ workspace }) => eq(workspace.id, workspaceId))
      .findOne()
  );

  return (
    <LiveQueryWrapper query={workspaceQuery}>
      <LiveQueryWrapper.Loading />
      <LiveQueryWrapper.Error />
      <LiveQueryWrapper.Ready>
        {(workspace: Organization) => (
          <div className="space-y-8">
            <h1 className="font-bold text-4xl">{workspace.name}</h1>
            <Tabs
              onValueChange={(tab) =>
                navigate({
                  from: "/workspaces/$workspaceId/",
                  to: ".",
                  search: { tab },
                })
              }
              value={tab}
            >
              <TabsList>
                {tabOptions.map(({ label, value }) => (
                  <TabsTrigger key={value} value={value}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent className="py-4" value={tab}>
                {pipe(
                  tab,
                  Match.value,
                  Match.when("members", () => <WorkspaceMembers />),
                  Match.when("invitation", () => <Invitations />),
                  Match.orElse(() => null)
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </LiveQueryWrapper.Ready>
    </LiveQueryWrapper>
  );
}
