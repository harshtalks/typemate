import QueryKeyFactory from "@harshtalks/query-keys";
import { isServer, QueryClient } from "@tanstack/react-query";
import { Match, pipe } from "effect";

/**
 * for grouping routes. i.e. all the user related routes will be grouped under
 *  "user" annotation so it's easy to invalidate them all at once.
 */
export interface QueryKeyAnnotations extends Record<string, unknown> {
  group: string;
}

const queryClient = null as null | QueryClient;

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
    Match.when(true, () => makeQueryClient()),
    Match.when(false, () => queryClient ?? makeQueryClient()),
    Match.exhaustive
  );

export const getQueryKeyFactory = () =>
  new QueryKeyFactory<QueryKeyAnnotations>(getQueryClient()).createQueryKey(
    "first"
  );

export type AnnotatedQueryKeyFactory = ReturnType<typeof getQueryKeyFactory>;
