import QueryKeyFactory from "@harshtalks/query-keys";
import { isServer, QueryClient } from "@tanstack/react-query";
import { Match, pipe } from "effect";
import type { QueryKeyAnnotations } from "./types";

const queryClient = null as null | QueryClient;

const makeQueryClient = new QueryClient({
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
    Match.when(true, () => makeQueryClient),
    Match.when(false, () => queryClient ?? makeQueryClient),
    Match.exhaustive
  );

export const queryKeyFactory = () =>
  new QueryKeyFactory<QueryKeyAnnotations>(getQueryClient()).createQueryKey(
    "first"
  );
