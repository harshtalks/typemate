import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { invitation } from "../schema";

export const invitationInsert = createInsertSchema(invitation, {
  id: z.string().transform(Branded.InvitationId).optional(),
  inviterId: z.string().transform(Branded.MemberId),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export const invitationSelect = createSelectSchema(invitation, {
  id: z.string().transform(Branded.InvitationId),
  inviterId: z.string().transform(Branded.MemberId),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export const invitationSelectArray = z.array(invitationSelect);
