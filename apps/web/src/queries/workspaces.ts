import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import {
  organizationInsert,
  organizationSelect,
} from "@typemate/db/parsers/organizations";
import { getQueryClient, queryKeyFactory } from "~/lib/react-query";
import { authRepo } from "~/rpcs/auth";

export const workspacesCollection = createCollection(
  queryCollectionOptions({
    queryKey: queryKeyFactory.keys.workspaces(),
    queryFn: async () => authRepo.getSessionWorkspaces(),
    queryClient: getQueryClient(),
    getKey: (item) => item.id,
    schema: organizationSelect,
    onInsert: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((mutation) =>
          authRepo.createSessionWorkspace({
            data: organizationInsert.parse(mutation.modified),
          })
        )
      );
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await authRepo.deleteWorkspace({
        data: {
          id: original.id,
        },
      });
    },
  })
);
