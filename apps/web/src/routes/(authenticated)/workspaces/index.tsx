import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import type { Organization } from "@typemate/db/schema";
import { Button } from "@typemate/ui/components/button";
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
import { NonEmptyArray } from "~/components/utils/array";
import { workspacesCollection } from "~/queries/workspaces";

export const Route = createFileRoute("/(authenticated)/workspaces/")({
  component: RouteComponent,
});

function RouteComponent() {
  const liveQuery = useLiveQuery((query) =>
    query.from({ workspace: workspacesCollection })
  );

  return (
    <div className="py-40">
      <LiveQueryWrapper query={liveQuery}>
        <LiveQueryWrapper.Loading />
        <LiveQueryWrapper.Error />
        <LiveQueryWrapper.Ready>
          {(workspaces: Organization[]) => {
            return (
              <div className="space-y-10">
                <div className="space-y-2">
                  <h1 className="font-semibold text-5xl">Workspaces</h1>
                  <p className="text-muted-foreground text-sm">
                    Workspaces are a way to group your notes together. You can
                    create a workspace, add notes to it, and then share it with
                    other users within the workspace.
                  </p>
                </div>

                <NonEmptyArray data={workspaces}>
                  <NonEmptyArray.WhenEmpty>
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia>
                          <EmptyIcon className="size-6" />
                        </EmptyMedia>
                        <EmptyTitle>No Workspaces</EmptyTitle>
                        <EmptyDescription>
                          You don&apos;t have any workspaces yet. Create one to
                          get started.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button>Create Workspace</Button>
                      </EmptyContent>
                    </Empty>
                  </NonEmptyArray.WhenEmpty>
                  <NonEmptyArray.WhenNonEmpty>
                    {(workspaces) => (
                      <div className="space-y-2">
                        {pipe(
                          workspaces,
                          Array.map((workspace: Organization) => (
                            <div key={workspace.id}>{workspace.id}</div>
                          ))
                        )}
                      </div>
                    )}
                  </NonEmptyArray.WhenNonEmpty>
                </NonEmptyArray>
              </div>
            );
          }}
        </LiveQueryWrapper.Ready>
      </LiveQueryWrapper>
    </div>
  );
}
