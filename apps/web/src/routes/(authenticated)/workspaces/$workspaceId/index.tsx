import {
  createFileRoute,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@typemate/ui/components/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@typemate/ui/components/tabs";
import { Match, pipe } from "effect";
import z from "zod";
import Invitations from "~/components/workspaces/invitations";
import Overview from "~/components/workspaces/overview";
import WorkspaceMembers from "~/components/workspaces/workspace-members";
import { getFallbackName } from "~/lib/helpers";

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
  const navigate = useNavigate();

  const { workspace } = useRouteContext({
    from: "/(authenticated)/workspaces/$workspaceId/",
  });

  if (!workspace) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Avatar className={"size-12 rounded-md"}>
          <AvatarFallback>{getFallbackName(workspace.name)}</AvatarFallback>
          <AvatarImage src={workspace.logo || undefined} />
        </Avatar>
        <h1 className="font-bold text-4xl">{workspace.name}</h1>
      </div>
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
            Match.when("overview", () => <Overview />),
            Match.orElse(() => null)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
