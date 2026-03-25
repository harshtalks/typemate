import { memberSelect } from "@typemate/db/parsers/members";
import { userSelect } from "@typemate/db/parsers/users";
import { Branded } from "@typemate/types";
import z from "zod";

export const memberWithUser = z.object({
  member: memberSelect,
  user: userSelect.or(z.null()),
});

export const memberWithUserArray = z.array(memberWithUser);

export type MemberWithUser = z.infer<typeof memberWithUser>;

export const currentWorkspaceCurrentUserMember = z.object({
  userId: z.string().transform(Branded.UserId),
  workspaceId: z.string().transform(Branded.OrganizationId),
});
