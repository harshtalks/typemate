import { useLiveQuery } from "@tanstack/react-db";
import type { Session } from "@typemate/db/schema";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import { EmptyIcon } from "@typemate/ui/components/icons";
import { Array, pipe } from "effect";
import SessionCard from "~/components/profile/session-card";
import { LiveQueryWrapper } from "~/components/shared/live-query-wrapper";
import { NonEmptyArray } from "~/components/utils/array";
import { sessionsCollection } from "~/queries/sessions";

const Sessions = () => {
  const liveQuery = useLiveQuery((query) =>
    query
      .from({ session: sessionsCollection })
      .orderBy(({ session }) => session.createdAt, "desc")
  );

  return (
    <div className="space-y-8">
      <h4 className="font-semibold text-3xl">Sessions</h4>
      <LiveQueryWrapper query={liveQuery}>
        <LiveQueryWrapper.Error />
        <LiveQueryWrapper.Loading />
        <LiveQueryWrapper.Ready>
          {(sessions: Session[]) => (
            <NonEmptyArray data={sessions}>
              <NonEmptyArray.WhenEmpty>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <EmptyIcon className="size-6" />
                    </EmptyMedia>
                    <EmptyTitle>No Sessions Found</EmptyTitle>
                    <EmptyDescription>
                      This seems to be a bug. Please report it to the
                      developers.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </NonEmptyArray.WhenEmpty>
              <NonEmptyArray.WhenNonEmpty>
                {(sessions) => (
                  <div className="space-y-8">
                    {pipe(
                      sessions,
                      Array.map((session: Session) => (
                        <SessionCard key={session.id} session={session} />
                      ))
                    )}
                  </div>
                )}
              </NonEmptyArray.WhenNonEmpty>
            </NonEmptyArray>
          )}
        </LiveQueryWrapper.Ready>
      </LiveQueryWrapper>
    </div>
  );
};

export default Sessions;
