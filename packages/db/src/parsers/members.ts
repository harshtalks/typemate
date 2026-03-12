import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { member } from "../schema";

export const memberInsert = createInsertSchema(member, {
  id: z.string().transform(Branded.MemberId).optional(),
  organizationId: z.string().transform(Branded.OrganizationId),
  userId: z.string().transform(Branded.UserId),
});

export const memberSelect = createSelectSchema(member, {
  id: z.string().transform(Branded.MemberId),
  organizationId: z.string().transform(Branded.OrganizationId),
  userId: z.string().transform(Branded.UserId),
});

export const memberSelectArray = z.array(memberSelect);
