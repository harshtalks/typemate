import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { pipe } from "effect";
import superjson from "superjson";
import { getQueryClient, queryKeyFactory } from "~/lib/react-query";
import { membersRepo } from "~/rpcs/members";
import { memberWithUser } from "~/rpcs/members/validator";
import { santizedLoadedSubsetOptions } from "./common";

export const membersCollection = createCollection(
  queryCollectionOptions({
    queryKey: queryKeyFactory.keys.members(),
    queryFn: ({ meta }) =>
      membersRepo.list({
        data: pipe(
          meta?.loadSubsetOptions,
          santizedLoadedSubsetOptions,
          superjson.stringify
        ),
      }),
    schema: memberWithUser,
    getKey: (item) => item.member.id,
    queryClient: getQueryClient(),
    syncMode: "on-demand",
  })
);
