import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { projectSelect } from "@typemate/db/parsers/project";
import { pipe } from "effect";
import SuperJSON from "superjson";
import { getQueryClient, queryKeyFactory } from "~/lib/react-query";
import { projectsRepo } from "~/rpcs/projects";
import { sanitizedLoadedSubsetOptions } from "./common";

export const projectsCollection = createCollection(
  queryCollectionOptions({
    queryClient: getQueryClient(),
    queryKey: queryKeyFactory.keys.projects(),
    schema: projectSelect,
    queryFn: ({ meta }) =>
      projectsRepo.list({
        data: pipe(
          meta?.loadSubsetOptions,
          sanitizedLoadedSubsetOptions,
          SuperJSON.stringify
        ),
      }),
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map((mutation) =>
          projectsRepo.create({ data: mutation.modified })
        )
      ),
    onDelete: async ({ transaction }) =>
      Promise.all(
        transaction.mutations.map((mutation) =>
          projectsRepo.remove({
            data: {
              id: mutation.modified.id,
              organizationId: mutation.modified.organizationId,
            },
          })
        )
      ),
    syncMode: "on-demand",
  })
);
