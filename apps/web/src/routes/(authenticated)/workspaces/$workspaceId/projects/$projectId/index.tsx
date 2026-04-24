import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import type { Project } from "@typemate/db/schema";
import { Badge } from "@typemate/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@typemate/ui/components/tabs";
import { Match, pipe } from "effect";
import z from "zod";

const searchParamsSchema = z.object({
  tab: z
    .union([
      z.literal("overview"),
      z.literal("templates"),
      z.literal("invoices"),
      z.literal("customers"),
      z.literal("settings"),
    ])
    .default("overview"),
});

export type ProjectRouteSearchParams = z.infer<typeof searchParamsSchema>;

const tabOptions: {
  label: string;
  value: ProjectRouteSearchParams["tab"];
}[] = [
  { label: "Overview", value: "overview" },
  { label: "Templates", value: "templates" },
  { label: "Invoices", value: "invoices" },
  { label: "Customers", value: "customers" },
  { label: "Settings", value: "settings" },
];

export const Route = createFileRoute(
  "/(authenticated)/workspaces/$workspaceId/projects/$projectId/"
)({
  component: RouteComponent,
  validateSearch: searchParamsSchema,
});

function RouteComponent() {
  const { tab } = Route.useSearch();

  const { project } = useRouteContext({
    from: "/(authenticated)/workspaces/$workspaceId/projects/$projectId/",
  });

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-4xl">{project.name}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{project.slug}</Badge>
          <Badge variant="outline">{project.currency}</Badge>
          <Badge variant="outline">{project.invoicePrefix}</Badge>
          <Badge variant="outline">{project.timezone}</Badge>
        </div>
      </div>
      <Tabs value={tab}>
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
            Match.when("overview", () => <ProjectOverview project={project} />),
            Match.orElse(() => (
              <p className="text-muted-foreground text-sm">Coming soon.</p>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Slug</p>
        <Badge>{project.slug}</Badge>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Currency</p>
        <p className="text-sm">{project.currency}</p>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Invoice Prefix</p>
        <p className="text-sm">{project.invoicePrefix}</p>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Timezone</p>
        <p className="text-sm">{project.timezone}</p>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Invoice Sequence</p>
        <p className="text-sm">{project.invoiceSequence} invoices generated</p>
      </div>
    </div>
  );
}
