import { Branded } from "@typemate/types";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { organization } from "../schema";

export const organizationInsert = createInsertSchema(organization, {
  id: z.string().transform(Branded.OrganizationId).optional(),
  metadata: z.any().optional(),
});

export const organizationSelect = createInsertSchema(organization, {
  id: z.string().transform(Branded.OrganizationId),
  metadata: z.any().optional(),
});

export const organizationSelectArray = z.array(organizationSelect);
