import { isServer, QueryClient } from "@tanstack/react-query";
import { Match, pipe } from "effect";
import QueryKeyFactory from "./factory";

/**
 * for grouping routes. i.e. all the user related routes will be grouped under
 *  "user" annotation so it's easy to invalidate them all at once.
 */
export interface QueryKeyAnnotations extends Record<string, unknown> {
  group: string;
}

let browserQueryClient: QueryClient | null = null;

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // for now
        retry: 0,
      },
    },
  });

export const getQueryClient = () =>
  pipe(
    isServer,
    Match.value,
    Match.when(true, makeQueryClient),
    Match.when(false, () => {
      if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
      }
      return browserQueryClient;
    }),
    Match.exhaustive
  );

export const queryKeyFactory = new QueryKeyFactory<QueryKeyAnnotations>(
  getQueryClient()
)
  .createQueryKey("user", {
    group: "auth",
  })
  .createQueryKey("workspaces", { group: "workspaces" })
  .createQueryKey("sessions", { group: "auth" })
  .createQueryKey("accounts", { group: "auth" });

export type AnnotatedQueryKeyFactory = typeof queryKeyFactory;
