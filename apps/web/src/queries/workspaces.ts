import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { organizationInsert } from "@typemate/db/parsers";
import { getQueryClient, queryKeyFactory } from "~/lib/react-query";
import { authRepo } from "~/rpcs/auth";

export const workspacesCollection = createCollection(
  queryCollectionOptions({
    queryKey: queryKeyFactory.keys.workspaces(),
    queryFn: async () => authRepo.getSessionWorkspaces(),
    queryClient: getQueryClient(),
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((mutation) =>
          authRepo.createSessionWorkspace({
            data: organizationInsert.parse(mutation.modified),
          })
        )
      );
    },
  })
);
