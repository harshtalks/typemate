import { Branded } from "@typemate/types";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { organization } from "../schema";

export const organizationInsert = createInsertSchema(organization, {
  id: z.string().transform(Branded.OrganizationId).optional(),
});

export const organizationSelect = createInsertSchema(organization, {
  id: z.string().transform(Branded.OrganizationId),
});

export const organizationSelectArray = z.array(organizationSelect);
