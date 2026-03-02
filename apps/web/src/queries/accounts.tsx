import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { accountSelect } from "@typemate/db/parsers/accounts";
import { getQueryClient, queryKeyFactory } from "~/lib/react-query";
import { authRepo } from "~/rpcs/auth";

export const accountsCollection = createCollection(
  queryCollectionOptions({
    queryKey: queryKeyFactory.keys.accounts(),
    queryFn: () => authRepo.getUserAccounts(),
    getKey: (item) => item.id,
    schema: accountSelect,
    queryClient: getQueryClient(),
  })
);
