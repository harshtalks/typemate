import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";
import z from "zod";

export const ac = createAccessControl({
  ...defaultStatements,
} as const);

export const roles = {
  owner: ac.newRole({
    ...ownerAc.statements,
  }),
  admin: ac.newRole({
    ...adminAc.statements,
  }),
  developer: ac.newRole({
    ...memberAc.statements,
    member: [],
    invitation: [],
    organization: [],
  }),
} as const;

export type Role = keyof typeof roles;

const roleNames = ["admin", "developer", "admin"] as Role[];

export const roleSchema = z.enum(roleNames);
