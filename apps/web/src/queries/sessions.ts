import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { sessionSelect } from "@typemate/db/parsers/sessions";
import { getQueryClient, queryKeyFactory } from "~/lib/react-query";
import { authRepo } from "~/rpcs/auth";

export const sessionsCollection = createCollection(
  queryCollectionOptions({
    queryKey: queryKeyFactory.keys.sessions(),
    queryFn: () => authRepo.getSessions(),
    getKey: (item) => item.id,
    schema: sessionSelect,
    queryClient: getQueryClient(),
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await authRepo.deleteSession({ data: { token: original.token } });
    },
  })
);
