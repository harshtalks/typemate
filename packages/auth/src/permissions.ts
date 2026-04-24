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
  project: ["create", "update", "delete"],
  template: ["create", "update", "delete"],
  invoice: ["create", "void"],
  apiKey: ["create", "delete"],
} as const);

export const roles = {
  owner: ac.newRole({
    ...ownerAc.statements,
    project: ["create", "update", "delete"],
    template: ["create", "update", "delete"],
    invoice: ["create", "void"],
    apiKey: ["create", "delete"],
  }),
  admin: ac.newRole({
    ...adminAc.statements,
    project: ["create", "update", "delete"],
    template: ["create", "update", "delete"],
    invoice: ["create", "void"],
    apiKey: ["create", "delete"],
  }),
  developer: ac.newRole({
    ...memberAc.statements,
    member: [],
    invitation: [],
    organization: [],
    project: [],
    template: [],
    invoice: ["create"],
    apiKey: [],
  }),
} as const;

export type Role = keyof typeof roles;

export type Permissions = {
  [K in keyof typeof ac.statements]?: (typeof ac.statements)[K][number][];
};

export const roleSchema = z.enum(["owner", "admin", "developer"] as const);
