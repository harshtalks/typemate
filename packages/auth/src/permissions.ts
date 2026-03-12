import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

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
