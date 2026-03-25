import { roleSchema } from "@typemate/auth/permissions";
import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { invitation } from "../schema";

export const invitationInsert = createInsertSchema(invitation, {
  id: z.string().transform(Branded.InvitationId).optional(),
  inviterId: z.string().transform(Branded.UserId),
  organizationId: z.string().transform(Branded.OrganizationId),
  role: roleSchema,
});

export const invitationSelect = createSelectSchema(invitation, {
  id: z.string().transform(Branded.InvitationId),
  inviterId: z.string().transform(Branded.UserId),
  organizationId: z.string().transform(Branded.OrganizationId),
  role: roleSchema,
});

export const invitationSelectArray = z.array(invitationSelect);
