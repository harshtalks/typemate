import { createServerFn } from "@tanstack/react-start";
import db from "@typemate/db";
import { member, user } from "@typemate/db/schema";
import { and, eq } from "drizzle-orm";
import { safeApiCall } from "~/lib/helpers";
import { serverFnMiddlewares } from "~/middlewares/auth";
import {
  castAsSanitizedLoadedSubsetOptions,
  parseSubsetOptionsForDB,
} from "~/queries/common";
import {
  currentWorkspaceCurrentUserMember,
  memberWithUserArray,
} from "./validator";

const list = createServerFn({ method: "GET" })
  .middleware(serverFnMiddlewares)
  .inputValidator(castAsSanitizedLoadedSubsetOptions)
  .handler(async ({ data }) => {
    const { offset, limit, sorts, filters } = parseSubsetOptionsForDB(
      member,
      data
    );

    return await safeApiCall(memberWithUserArray)(() =>
      db
        .select()
        .from(member)
        .limit(limit ?? 10)
        .offset(offset ?? 0)
        .orderBy(...sorts)
        .where(and(...filters))
        .leftJoin(user, eq(member.userId, user.id))
        .execute()
    );
  });

const getCurrentWorkspaceCurrentUserMember = createServerFn({ method: "GET" })
  .middleware(serverFnMiddlewares)
  .inputValidator(currentWorkspaceCurrentUserMember)
  .handler(async ({ data }) => {
    const { userId, workspaceId } = data;

    return await db.query.member.findFirst({
      where: (member) =>
        and(eq(member.userId, userId), eq(member.organizationId, workspaceId)),
    });
  });

export const membersRepo = {
  list,
  getCurrentWorkspaceCurrentUserMember,
};
