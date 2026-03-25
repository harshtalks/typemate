import type { Role } from "@typemate/auth/permissions";
import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { invitation } from "../schema";

const roles = ["admin", "developer", "admin"] as Role[];

export const invitationInsert = createInsertSchema(invitation, {
  id: z.string().transform(Branded.InvitationId).optional(),
  inviterId: z.string().transform(Branded.UserId),
  organizationId: z.string().transform(Branded.OrganizationId),
  role: z.enum(roles),
});

export const invitationSelect = createSelectSchema(invitation, {
  id: z.string().transform(Branded.InvitationId),
  inviterId: z.string().transform(Branded.UserId),
  organizationId: z.string().transform(Branded.OrganizationId),
  role: z.enum(roles),
});

export const invitationSelectArray = z.array(invitationSelect);
