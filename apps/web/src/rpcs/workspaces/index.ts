import { createServerFn } from "@tanstack/react-start";
import db from "@typemate/db";
import { eq } from "drizzle-orm";
import { serverFnMiddlewares } from "~/middlewares/auth";
import { workspaceByIdSchema } from "./valisator";

const get = createServerFn({ method: "GET" })
  .middleware(serverFnMiddlewares)
  .inputValidator(workspaceByIdSchema)
  .handler(({ data: { id: workspaceId } }) =>
    db.query.organization.findFirst({
      where: (table) => eq(table.id, workspaceId),
      with: {
        members: true,
      },
    })
  );

export const workspacesRepo = { get };
