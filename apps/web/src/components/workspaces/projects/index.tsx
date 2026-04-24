import { eq, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import type { Project } from "@typemate/db/schema";
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
import { LiveQueryWrapper } from "~/components/shared/live-query-wrapper";
import { PermissionGate } from "~/components/shared/permission-gate";
import { NonEmptyArray } from "~/components/utils/array";
import { projectsCollection } from "~/queries/projects";
import CreateProject from "./create-project";
import ProjectCard from "./project-card";

const Projects = () => {
  const { workspaceId } = useParams({
    from: "/(authenticated)/workspaces/$workspaceId/",
  });

  const liveQuery = useLiveQuery((query) =>
    query
      .from({ project: projectsCollection })
      .where(({ project }) =>
        eq(project.organizationId, Branded.OrganizationId(workspaceId))
      )
  );

  return (
    <LiveQueryWrapper query={liveQuery}>
      <LiveQueryWrapper.Error />
      <LiveQueryWrapper.Loading />
      <LiveQueryWrapper.Ready>
        {(projects: Project[]) => (
          <NonEmptyArray data={projects}>
            <NonEmptyArray.WhenEmpty>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <EmptyIcon className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle>No Projects</EmptyTitle>
                  <EmptyDescription>
                    Create your first project to start building templates and
                    invoices.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <PermissionGate permission={{ project: ["create"] }}>
                    <CreateProject />
                  </PermissionGate>
                </EmptyContent>
              </Empty>
            </NonEmptyArray.WhenEmpty>
            <NonEmptyArray.WhenNonEmpty>
              {(projects) => (
                <div className="space-y-8">
                  {pipe(
                    projects,
                    Array.map((project: Project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        workspaceId={workspaceId}
                      />
                    ))
                  )}
                  <PermissionGate permission={{ project: ["create"] }}>
                    <CreateProject />
                  </PermissionGate>
                </div>
              )}
            </NonEmptyArray.WhenNonEmpty>
          </NonEmptyArray>
        )}
      </LiveQueryWrapper.Ready>
    </LiveQueryWrapper>
  );
};

export default Projects;
