import type { UseLiveQueryStatus } from "@tanstack/react-db";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import {
  EmptyIcon,
  SpinnerIcon,
  WarningIcon,
} from "@typemate/ui/components/icons";
import { Match, pipe } from "effect";
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
} from "react";

export interface UseLiveQueryReturn<State, Data, Collection> {
  state: State | undefined;
  data: Data | undefined;
  collection: Collection | undefined;
  status: UseLiveQueryStatus;
  isLoading: boolean;
  isReady: boolean;
  isIdle: boolean;
  isError: boolean;
  isCleanedUp: boolean;
  isEnabled: boolean;
}

export const liveQueryWrapperContext = createContext<UseLiveQueryReturn<
  unknown,
  unknown,
  unknown
> | null>(null);

export const useLiveQueryWrapper = () => {
  const ctx = useContext(liveQueryWrapperContext);

  if (!ctx) {
    throw new Error(
      "useLiveQueryWrapper must be used within a LiveQueryWrapper"
    );
  }

  return ctx;
};

export const LiveQueryWrapper = <State, Data, Collection>(
  props: PropsWithChildren<{
    query: UseLiveQueryReturn<State, Data, Collection>;
  }>
) => {
  return (
    <liveQueryWrapperContext.Provider value={props.query}>
      {props.children}
    </liveQueryWrapperContext.Provider>
  );
};

LiveQueryWrapper.Idle = (props: PropsWithChildren) => {
  const { isIdle } = useLiveQueryWrapper();

  return pipe(
    isIdle,
    Match.value,
    Match.when(
      true,
      () =>
        props.children ?? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <EmptyIcon />
              </EmptyMedia>
              <EmptyTitle>No data</EmptyTitle>
              <EmptyDescription>No data available</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
    ),
    Match.orElse(() => null)
  );
};

/** Sync has started and is loading data */
LiveQueryWrapper.Loading = (props: PropsWithChildren) => {
  const { isLoading } = useLiveQueryWrapper();

  return pipe(
    isLoading,
    Match.value,
    Match.when(
      true,
      () =>
        props.children ?? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <SpinnerIcon className="animate-spin" />
              </EmptyMedia>
              <EmptyTitle>Loading..</EmptyTitle>
              <EmptyDescription>
                Please wait while we load your data
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
    ),
    Match.orElse(() => null)
  );
};

/** Collection has been explicitly marked ready via markReady() */
LiveQueryWrapper.Ready = <T,>(props: { children: (data: T) => ReactNode }) => {
  const { isReady, data } = useLiveQueryWrapper();

  return pipe(
    isReady,
    Match.value,
    Match.when(true, () => props.children(data as T)),
    Match.orElse(() => null)
  );
};

/** An error occurred during sync initialization */
LiveQueryWrapper.Error = (props: PropsWithChildren) => {
  const { isError } = useLiveQueryWrapper();

  return pipe(
    isError,
    Match.value,
    Match.when(
      true,
      () =>
        props.children ?? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <WarningIcon />
              </EmptyMedia>
              <EmptyTitle>Error</EmptyTitle>
              <EmptyDescription>
                Something went wrong while loading your data
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
    ),
    Match.orElse(() => null)
  );
};

/** Collection has been cleaned up and resources freed */
LiveQueryWrapper.CleanedUp = (props: PropsWithChildren) => {
  const { isCleanedUp } = useLiveQueryWrapper();

  return pipe(
    isCleanedUp,
    Match.value,
    Match.when(
      true,
      () =>
        props.children ?? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <EmptyIcon />
              </EmptyMedia>
              <EmptyTitle>Data Cleaned</EmptyTitle>
              <EmptyDescription>
                Your data has been removed from the cache
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
    ),
    Match.orElse(() => null)
  );
};
