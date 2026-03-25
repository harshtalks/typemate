import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { invitationSelect } from "@typemate/db/parsers/invitation";
import { pipe } from "effect";
import SuperJSON from "superjson";
import { getQueryClient, queryKeyFactory } from "~/lib/react-query";
import { invitationRepo } from "~/rpcs/invitation";
import {
  parseLoadSubsetOptionsForAuth,
  sanitizedLoadedSubsetOptions,
} from "./common";

export const invitationsCollection = createCollection(
  queryCollectionOptions({
    queryClient: getQueryClient(),
    queryKey: queryKeyFactory.keys.invitations(),
    schema: invitationSelect.omit({
      status: true,
    }),
    queryFn: ({ meta }) =>
      invitationRepo.list({
        data: pipe(
          meta?.loadSubsetOptions,
          (x) => {
            console.log({ x: parseLoadSubsetOptionsForAuth(x) });
            return x;
          },
          sanitizedLoadedSubsetOptions,
          SuperJSON.stringify
        ),
      }),
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map((mutation) =>
          invitationRepo.add({
            data: mutation.modified,
          })
        )
      ),
    syncMode: "on-demand",
  })
);
