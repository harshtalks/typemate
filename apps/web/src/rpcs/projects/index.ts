import { createServerFn } from "@tanstack/react-start";
import db from "@typemate/db";
import {
  projectSelect,
  projectSelectArray,
} from "@typemate/db/parsers/project";
import { project } from "@typemate/db/schema";
import { and, eq } from "drizzle-orm";
import { requirePermission } from "~/lib/guards";
import { safeApiCall } from "~/lib/helpers";
import { serverFnMiddlewares } from "~/middlewares/auth";
import {
  castAsSanitizedLoadedSubsetOptions,
  parseSubsetOptionsForDB,
} from "~/queries/common";
import {
  projectByIdSchema,
  projectCreateSchema,
  projectDeleteSchema,
} from "./validators";

const list = createServerFn({ method: "GET" })
  .middleware(serverFnMiddlewares)
  .inputValidator(castAsSanitizedLoadedSubsetOptions)
  .handler(async ({ data }) => {
    const { offset, limit, sorts, filters } = parseSubsetOptionsForDB(
      project,
      data
    );
    return await safeApiCall(projectSelectArray)(() =>
      db
        .select()
        .from(project)
        .limit(limit ?? 50)
        .offset(offset ?? 0)
        .orderBy(...sorts)
        .where(and(...filters))
        .execute()
    );
  });

const get = createServerFn({ method: "GET" })
  .middleware(serverFnMiddlewares)
  .inputValidator(projectByIdSchema)
  .handler(({ data }) =>
    db.query.project.findFirst({
      where: (table) => eq(table.id, data.id),
    })
  );

const create = createServerFn({ method: "POST" })
  .middleware(serverFnMiddlewares)
  .inputValidator(projectCreateSchema)
  .handler(async ({ data }) => {
    await requirePermission({ project: ["create"] }, data.organizationId);
    const [result] = await db.insert(project).values(data).returning();
    return projectSelect.parse(result);
  });

const remove = createServerFn({ method: "POST" })
  .middleware(serverFnMiddlewares)
  .inputValidator(projectDeleteSchema)
  .handler(async ({ data }) => {
    await requirePermission({ project: ["delete"] }, data.organizationId);
    const [result] = await db
      .delete(project)
      .where(eq(project.id, data.id))
      .returning();
    return projectSelect.parse(result);
  });

export const projectsRepo = { list, get, create, remove };
